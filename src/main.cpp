#include <node_api.h>
#include <string>
#include <ctype.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>

extern "C" {
  #include <CoreServices/CoreServices.h>
}

/*
 * c2cf: convert a C string to CFStringRef
 *
 * parameters:
 *	cstr: the C string to convert
 *	cfstr: will point to result of conversion. must be CFRelease'd.
 *
 * return value:
 *	 0: success
 *	-1: failure
 *
 * @see https://github.com/moretension/duti/blob/master/util.c
 */
int c2cf( char *cstr, CFStringRef *cfstr )
{
    CFStringRef		cftmp;

    if ( cstr == NULL ) {
	     return( -1 );
    }

    if (( cftmp = CFStringCreateWithBytes( kCFAllocatorDefault,
			( UInt8 * )cstr, ( CFIndex )strlen( cstr ),
			kCFStringEncodingUTF8, false )) == NULL ) {
	       return( -1 );
    }

    *cfstr = cftmp;

    return( 0 );
}

/*
 * cf2c: convert a CFStringRef to a C string
 *
 * parameters:
 *	cfstr: CFStringRef to convert to C string
 *	cstr: char buffer that will contain result of conversion
 *	len: size of cstr buffer
 *
 * return value:
 *	-1: conversion failed
 *	 0: success
 *
 * @see https://github.com/moretension/duti/blob/master/util.c
 */
int cf2c( CFStringRef cfstr, char *cstr, int len )
{
    if ( cfstr == NULL ) {
	     return( -1 );
    }

    if ( CFStringGetCString( cfstr, cstr, ( CFIndex )len,
		kCFStringEncodingUTF8 ) == false ) {
	     return( -1 );
    }

    return( 0 );
}

/*
 * cfurl2path: convert a CFURLRef to a POSIX C string path
 *
 * parameters:
 *	cfurl: CFURLRef to convert to C string path
 *	cstr: char buffer that will contain result of conversion
 *	len: size of cstr buffer
 *
 * return value:
 *	-1: conversion failed
 *	 0: success
 *
 * @see https://github.com/moretension/duti/blob/master/util.c
 */
int cfurl2path( CFURLRef cfurl, char *cstr, int len )
{
    if ( cfurl == NULL ) {
	      return( -1 );
    }

    if ( !CFURLGetFileSystemRepresentation( cfurl, false, (UInt8 *)cstr, len)) {
	     return( -1 );
    }

    return( 0 );
}

napi_value getItems(napi_env env, napi_callback_info info) {
  LSSharedFileListRef sflRef = LSSharedFileListCreate(kCFAllocatorDefault, kLSSharedFileListFavoriteItems, NULL);
  CFArrayRef list = LSSharedFileListCopySnapshot(sflRef, NULL);

  napi_value items;
  napi_create_array(env, &items);

  for( unsigned int a = 0; a < CFArrayGetCount(list); a = a + 1 ) {
    LSSharedFileListItemRef sflItemRef = (LSSharedFileListItemRef) CFArrayGetValueAtIndex(list, a);

    CFURLRef urlRef = NULL;
    LSSharedFileListItemResolve(sflItemRef, kLSSharedFileListNoUserInteraction | kLSSharedFileListDoNotMountVolumes, &urlRef, NULL);

    char	url[1024];
    cfurl2path(urlRef, url, sizeof(url));
    napi_value result;
    napi_create_string_utf8(env, url, strlen(url), &result);
    napi_set_element(env, items, a, result);
  }

  CFRelease(sflRef);
  return items;
}

napi_value addItem(napi_env env, napi_callback_info info) {
  napi_value argv[1];
  size_t argc = 1;

  napi_get_cb_info(env, info, &argc, argv, NULL, NULL);

  if (argc < 1) {
    napi_throw_error(env, "EINVAL", "Too few arguments");
    return NULL;
  }

  char c_uri[1024];
  size_t str_len;

  if (napi_get_value_string_utf8(env, argv[0], (char *) &c_uri, 1024, &str_len) != napi_ok) {
    napi_throw_error(env, "EINVAL", "Expected string");
    return NULL;
  }

  CFStringRef uriref;
  c2cf(c_uri, &uriref);

/*
  char *fileicon="file:///Users/testuser/dev/balloon-client-desktop/resources/diricon/icon.png";
  CFStringRef iconuriref;
  c2cf(fileicon, &iconuriref);

  IconRef iconRef;
  FSRef fref;
  CFURLGetFSRef(iconuriref, &fref);
  RegisterIconRefFromFSRef('SSBL', 'ssic', &fref, &iconRef);
  IconRef icon = IconRefFromIconFileNoCache(iconuriref);
*/

  CFURLRef url = CFURLCreateWithString(NULL, uriref, NULL);
  LSSharedFileListRef sflRef = LSSharedFileListCreate(kCFAllocatorDefault, kLSSharedFileListFavoriteItems, NULL);

  if (!sflRef) {
    napi_throw_error(env, NULL, "Unable to create sidebar list, LSSharedFileListCreate() fails.");
  }

  LSSharedFileListInsertItemURL(sflRef, kLSSharedFileListItemBeforeFirst, NULL, NULL, url, NULL, NULL);
  CFRelease(sflRef);
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, NULL, 0, addItem, NULL, &fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to wrap native function");
  }

  status = napi_set_named_property(env, exports, "addItem", fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to populate exports");
  }

  status = napi_create_function(env, NULL, 0, getItems, NULL, &fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to wrap native function");
  }

  status = napi_set_named_property(env, exports, "getItems", fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to populate exports");
  }

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)

{
  "targets": [
    {
      "include_dirs": [],
      "target_name": "addon",
      "conditions": [
        ['OS=="mac"', {
          "sources": [ "src/main.cpp" ],
          "libraries": [ "-framework CoreServices" ],
        }],
      ],
    }
  ]
}

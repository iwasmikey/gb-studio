var createBinjgb = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;

  return (
      function(createBinjgb) {
          createBinjgb = createBinjgb || {};

          var Module = typeof createBinjgb !== "undefined" ? createBinjgb : {};
          var readyPromiseResolve, readyPromiseReject;
          Module["ready"] = new Promise(function(resolve, reject) {
              readyPromiseResolve = resolve;
              readyPromiseReject = reject
          });
          var moduleOverrides = {};
          var key;
          for (key in Module) {
              if (Module.hasOwnProperty(key)) {
                  moduleOverrides[key] = Module[key]
              }
          }
          var arguments_ = [];
          var thisProgram = "./this.program";
          var quit_ = function(status, toThrow) {
              throw toThrow
          };
          var ENVIRONMENT_IS_WEB = true;
          var ENVIRONMENT_IS_WORKER = false;
          var scriptDirectory = "";

          function locateFile(path) {
              if (Module["locateFile"]) {
                  return Module["locateFile"](path, scriptDirectory)
              }
              return scriptDirectory + path
          }
          var read_, readAsync, readBinary, setWindowTitle;
          if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
              if (ENVIRONMENT_IS_WORKER) {
                  scriptDirectory = self.location.href
              } else if (typeof document !== "undefined" && document.currentScript) {
                  scriptDirectory = document.currentScript.src
              }
              if (_scriptDir) {
                  scriptDirectory = _scriptDir
              }
              if (scriptDirectory.indexOf("blob:") !== 0) {
                  scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1)
              } else {
                  scriptDirectory = ""
              } {
                  read_ = function(url) {
                      var xhr = new XMLHttpRequest;
                      xhr.open("GET", url, false);
                      xhr.send(null);
                      return xhr.responseText
                  };
                  if (ENVIRONMENT_IS_WORKER) {
                      readBinary = function(url) {
                          var xhr = new XMLHttpRequest;
                          xhr.open("GET", url, false);
                          xhr.responseType = "arraybuffer";
                          xhr.send(null);
                          return new Uint8Array(xhr.response)
                      }
                  }
                  readAsync = function(url, onload, onerror) {
                      var xhr = new XMLHttpRequest;
                      xhr.open("GET", url, true);
                      xhr.responseType = "arraybuffer";
                      xhr.onload = function() {
                          if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                              onload(xhr.response);
                              return
                          }
                          onerror()
                      };
                      xhr.onerror = onerror;
                      xhr.send(null)
                  }
              }
              setWindowTitle = function(title) {
                  document.title = title
              }
          } else {}
          var out = Module["print"] || console.log.bind(console);
          var err = Module["printErr"] || console.warn.bind(console);
          for (key in moduleOverrides) {
              if (moduleOverrides.hasOwnProperty(key)) {
                  Module[key] = moduleOverrides[key]
              }
          }
          moduleOverrides = null;
          if (Module["arguments"]) arguments_ = Module["arguments"];
          if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
          if (Module["quit"]) quit_ = Module["quit"];
          var wasmBinary;
          if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
          var noExitRuntime = Module["noExitRuntime"] || true;
          if (typeof WebAssembly !== "object") {
              abort("no native wasm support detected")
          }
          var wasmMemory;
          var ABORT = false;
          var EXITSTATUS;
          var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

          function UTF8ArrayToString(heap, idx, maxBytesToRead) {
              var endIdx = idx + maxBytesToRead;
              var endPtr = idx;
              while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
              if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
                  return UTF8Decoder.decode(heap.subarray(idx, endPtr))
              } else {
                  var str = "";
                  while (idx < endPtr) {
                      var u0 = heap[idx++];
                      if (!(u0 & 128)) {
                          str += String.fromCharCode(u0);
                          continue
                      }
                      var u1 = heap[idx++] & 63;
                      if ((u0 & 224) == 192) {
                          str += String.fromCharCode((u0 & 31) << 6 | u1);
                          continue
                      }
                      var u2 = heap[idx++] & 63;
                      if ((u0 & 240) == 224) {
                          u0 = (u0 & 15) << 12 | u1 << 6 | u2
                      } else {
                          u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
                      }
                      if (u0 < 65536) {
                          str += String.fromCharCode(u0)
                      } else {
                          var ch = u0 - 65536;
                          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                      }
                  }
              }
              return str
          }

          function UTF8ToString(ptr, maxBytesToRead) {
              return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
          }
          var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

          function updateGlobalBufferAndViews(buf) {
              buffer = buf;
              Module["HEAP8"] = HEAP8 = new Int8Array(buf);
              Module["HEAP16"] = HEAP16 = new Int16Array(buf);
              Module["HEAP32"] = HEAP32 = new Int32Array(buf);
              Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
              Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
              Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
              Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
              Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
          }
          var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
          var wasmTable;
          var __ATPRERUN__ = [];
          var __ATINIT__ = [];
          var __ATMAIN__ = [];
          var __ATPOSTRUN__ = [];
          var runtimeInitialized = false;
          var runtimeExited = false;
          __ATINIT__.push({
              func: function() {
                  ___wasm_call_ctors()
              }
          });

          function preRun() {
              if (Module["preRun"]) {
                  if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                  while (Module["preRun"].length) {
                      addOnPreRun(Module["preRun"].shift())
                  }
              }
              callRuntimeCallbacks(__ATPRERUN__)
          }

          function initRuntime() {
              runtimeInitialized = true;
              callRuntimeCallbacks(__ATINIT__)
          }

          function preMain() {
              callRuntimeCallbacks(__ATMAIN__)
          }

          function exitRuntime() {
              runtimeExited = true
          }

          function postRun() {
              if (Module["postRun"]) {
                  if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                  while (Module["postRun"].length) {
                      addOnPostRun(Module["postRun"].shift())
                  }
              }
              callRuntimeCallbacks(__ATPOSTRUN__)
          }

          function addOnPreRun(cb) {
              __ATPRERUN__.unshift(cb)
          }

          function addOnPostRun(cb) {
              __ATPOSTRUN__.unshift(cb)
          }
          var runDependencies = 0;
          var runDependencyWatcher = null;
          var dependenciesFulfilled = null;

          function addRunDependency(id) {
              runDependencies++;
              if (Module["monitorRunDependencies"]) {
                  Module["monitorRunDependencies"](runDependencies)
              }
          }

          function removeRunDependency(id) {
              runDependencies--;
              if (Module["monitorRunDependencies"]) {
                  Module["monitorRunDependencies"](runDependencies)
              }
              if (runDependencies == 0) {
                  if (runDependencyWatcher !== null) {
                      clearInterval(runDependencyWatcher);
                      runDependencyWatcher = null
                  }
                  if (dependenciesFulfilled) {
                      var callback = dependenciesFulfilled;
                      dependenciesFulfilled = null;
                      callback()
                  }
              }
          }
          Module["preloadedImages"] = {};
          Module["preloadedAudios"] = {};

          function abort(what) {
              if (Module["onAbort"]) {
                  Module["onAbort"](what)
              }
              what += "";
              err(what);
              ABORT = true;
              EXITSTATUS = 1;
              what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
              var e = new WebAssembly.RuntimeError(what);
              readyPromiseReject(e);
              throw e
          }

          function hasPrefix(str, prefix) {
              return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0
          }
          var dataURIPrefix = "data:application/octet-stream;base64,";

          function isDataURI(filename) {
              return hasPrefix(filename, dataURIPrefix)
          }
          var wasmBinaryFile = "binjgb.wasm";
          if (!isDataURI(wasmBinaryFile)) {
              wasmBinaryFile = locateFile(wasmBinaryFile)
          }

          function getBinary(file) {
              try {
                  if (file == wasmBinaryFile && wasmBinary) {
                      return new Uint8Array(wasmBinary)
                  }
                  if (readBinary) {
                      return readBinary(file)
                  } else {
                      throw "both async and sync fetching of the wasm failed"
                  }
              } catch (err) {
                  abort(err)
              }
          }

          function getBinaryPromise() {
              if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
                  if (typeof fetch === "function") {
                      return fetch(wasmBinaryFile, {
                          credentials: "same-origin"
                      }).then(function(response) {
                          if (!response["ok"]) {
                              throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                          }
                          return response["arrayBuffer"]()
                      }).catch(function() {
                          return getBinary(wasmBinaryFile)
                      })
                  }
              }
              return Promise.resolve().then(function() {
                  return getBinary(wasmBinaryFile)
              })
          }

          function createWasm() {
              var info = {
                  "a": asmLibraryArg
              };

              function receiveInstance(instance, module) {
                  var exports = instance.exports;
                  Module["asm"] = exports;
                  wasmMemory = Module["asm"]["g"];
                  updateGlobalBufferAndViews(wasmMemory.buffer);
                  wasmTable = Module["asm"]["G"];
                  removeRunDependency("wasm-instantiate")
              }
              addRunDependency("wasm-instantiate");

              function receiveInstantiatedSource(output) {
                  receiveInstance(output["instance"])
              }

              function instantiateArrayBuffer(receiver) {
                  return getBinaryPromise().then(function(binary) {
                      return WebAssembly.instantiate(binary, info)
                  }).then(receiver, function(reason) {
                      err("failed to asynchronously prepare wasm: " + reason);
                      abort(reason)
                  })
              }

              function instantiateAsync() {
                  if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
                      return fetch(wasmBinaryFile, {
                          credentials: "same-origin"
                      }).then(function(response) {
                          var result = WebAssembly.instantiateStreaming(response, info);
                          return result.then(receiveInstantiatedSource, function(reason) {
                              err("wasm streaming compile failed: " + reason);
                              err("falling back to ArrayBuffer instantiation");
                              return instantiateArrayBuffer(receiveInstantiatedSource)
                          })
                      })
                  } else {
                      return instantiateArrayBuffer(receiveInstantiatedSource)
                  }
              }
              if (Module["instantiateWasm"]) {
                  try {
                      var exports = Module["instantiateWasm"](info, receiveInstance);
                      return exports
                  } catch (e) {
                      err("Module.instantiateWasm callback failed with error: " + e);
                      return false
                  }
              }
              instantiateAsync().catch(readyPromiseReject);
              return {}
          }

          function callRuntimeCallbacks(callbacks) {
              while (callbacks.length > 0) {
                  var callback = callbacks.shift();
                  if (typeof callback == "function") {
                      callback(Module);
                      continue
                  }
                  var func = callback.func;
                  if (typeof func === "number") {
                      if (callback.arg === undefined) {
                          wasmTable.get(func)()
                      } else {
                          wasmTable.get(func)(callback.arg)
                      }
                  } else {
                      func(callback.arg === undefined ? null : callback.arg)
                  }
              }
          }

          function _emscripten_memcpy_big(dest, src, num) {
              HEAPU8.copyWithin(dest, src, src + num)
          }

          function abortOnCannotGrowMemory(requestedSize) {
              abort("OOM")
          }

          function _emscripten_resize_heap(requestedSize) {
              abortOnCannotGrowMemory(requestedSize)
          }

          function _exit(status) {
              exit(status)
          }
          var SYSCALLS = {
              mappings: {},
              buffers: [null, [],
                  []
              ],
              printChar: function(stream, curr) {
                  var buffer = SYSCALLS.buffers[stream];
                  if (curr === 0 || curr === 10) {
                      (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
                      buffer.length = 0
                  } else {
                      buffer.push(curr)
                  }
              },
              varargs: undefined,
              get: function() {
                  SYSCALLS.varargs += 4;
                  var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
                  return ret
              },
              getStr: function(ptr) {
                  var ret = UTF8ToString(ptr);
                  return ret
              },
              get64: function(low, high) {
                  return low
              }
          };

          function _fd_close(fd) {
              return 0
          }

          function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {}

          function _fd_write(fd, iov, iovcnt, pnum) {
              var num = 0;
              for (var i = 0; i < iovcnt; i++) {
                  var ptr = HEAP32[iov + i * 8 >> 2];
                  var len = HEAP32[iov + (i * 8 + 4) >> 2];
                  for (var j = 0; j < len; j++) {
                      SYSCALLS.printChar(fd, HEAPU8[ptr + j])
                  }
                  num += len
              }
              HEAP32[pnum >> 2] = num;
              return 0
          }
          var asmLibraryArg = {
              "d": _emscripten_memcpy_big,
              "e": _emscripten_resize_heap,
              "b": _exit,
              "f": _fd_close,
              "c": _fd_seek,
              "a": _fd_write
          };
          var asm = createWasm();
          var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
              return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["h"]).apply(null, arguments)
          };
          var _malloc = Module["_malloc"] = function() {
              return (_malloc = Module["_malloc"] = Module["asm"]["i"]).apply(null, arguments)
          };
          var _emulator_set_builtin_palette = Module["_emulator_set_builtin_palette"] = function() {
              return (_emulator_set_builtin_palette = Module["_emulator_set_builtin_palette"] = Module["asm"]["j"]).apply(null, arguments)
          };
          var _emulator_was_ext_ram_updated = Module["_emulator_was_ext_ram_updated"] = function() {
              return (_emulator_was_ext_ram_updated = Module["_emulator_was_ext_ram_updated"] = Module["asm"]["k"]).apply(null, arguments)
          };
          var _emulator_read_ext_ram = Module["_emulator_read_ext_ram"] = function() {
              return (_emulator_read_ext_ram = Module["_emulator_read_ext_ram"] = Module["asm"]["l"]).apply(null, arguments)
          };
          var _emulator_write_ext_ram = Module["_emulator_write_ext_ram"] = function() {
              return (_emulator_write_ext_ram = Module["_emulator_write_ext_ram"] = Module["asm"]["m"]).apply(null, arguments)
          };
          var _file_data_delete = Module["_file_data_delete"] = function() {
              return (_file_data_delete = Module["_file_data_delete"] = Module["asm"]["n"]).apply(null, arguments)
          };
          var _free = Module["_free"] = function() {
              return (_free = Module["_free"] = Module["asm"]["o"]).apply(null, arguments)
          };
          var _emulator_delete = Module["_emulator_delete"] = function() {
              return (_emulator_delete = Module["_emulator_delete"] = Module["asm"]["p"]).apply(null, arguments)
          };
          var _emulator_get_PC = Module["_emulator_get_PC"] = function() {
              return (_emulator_get_PC = Module["_emulator_get_PC"] = Module["asm"]["q"]).apply(null, arguments)
          };
          var _emulator_get_A = Module["_emulator_get_A"] = function() {
              return (_emulator_get_A = Module["_emulator_get_A"] = Module["asm"]["r"]).apply(null, arguments)
          };
          var _emulator_get_BC = Module["_emulator_get_BC"] = function() {
              return (_emulator_get_BC = Module["_emulator_get_BC"] = Module["asm"]["s"]).apply(null, arguments)
          };
          var _emulator_get_DE = Module["_emulator_get_DE"] = function() {
              return (_emulator_get_DE = Module["_emulator_get_DE"] = Module["asm"]["t"]).apply(null, arguments)
          };
          var _emulator_get_HL = Module["_emulator_get_HL"] = function() {
              return (_emulator_get_HL = Module["_emulator_get_HL"] = Module["asm"]["u"]).apply(null, arguments)
          };
          var _emulator_get_F = Module["_emulator_get_F"] = function() {
              return (_emulator_get_F = Module["_emulator_get_F"] = Module["asm"]["v"]).apply(null, arguments)
          };
          var _emulator_get_SP = Module["_emulator_get_SP"] = function() {
              return (_emulator_get_SP = Module["_emulator_get_SP"] = Module["asm"]["w"]).apply(null, arguments)
          };
          var _emulator_set_PC = Module["_emulator_set_PC"] = function() {
              return (_emulator_set_PC = Module["_emulator_set_PC"] = Module["asm"]["x"]).apply(null, arguments)
          };
          var _emulator_set_breakpoint = Module["_emulator_set_breakpoint"] = function() {
              return (_emulator_set_breakpoint = Module["_emulator_set_breakpoint"] = Module["asm"]["y"]).apply(null, arguments)
          };
          var _emulator_clear_breakpoints = Module["_emulator_clear_breakpoints"] = function() {
              return (_emulator_clear_breakpoints = Module["_emulator_clear_breakpoints"] = Module["asm"]["z"]).apply(null, arguments)
          };
          var _emulator_render_vram = Module["_emulator_render_vram"] = function() {
              return (_emulator_render_vram = Module["_emulator_render_vram"] = Module["asm"]["A"]).apply(null, arguments)
          };
          var _emulator_render_background = Module["_emulator_render_background"] = function() {
              return (_emulator_render_background = Module["_emulator_render_background"] = Module["asm"]["B"]).apply(null, arguments)
          };
          var _emulator_get_wram_ptr = Module["_emulator_get_wram_ptr"] = function() {
              return (_emulator_get_wram_ptr = Module["_emulator_get_wram_ptr"] = Module["asm"]["C"]).apply(null, arguments)
          };
          var _emulator_get_hram_ptr = Module["_emulator_get_hram_ptr"] = function() {
              return (_emulator_get_hram_ptr = Module["_emulator_get_hram_ptr"] = Module["asm"]["D"]).apply(null, arguments)
          };
          var _emulator_read_mem = Module["_emulator_read_mem"] = function() {
              return (_emulator_read_mem = Module["_emulator_read_mem"] = Module["asm"]["E"]).apply(null, arguments)
          };
          var _emulator_write_mem = Module["_emulator_write_mem"] = function() {
              return (_emulator_write_mem = Module["_emulator_write_mem"] = Module["asm"]["F"]).apply(null, arguments)
          };
          var _joypad_new = Module["_joypad_new"] = function() {
              return (_joypad_new = Module["_joypad_new"] = Module["asm"]["H"]).apply(null, arguments)
          };
          var _joypad_delete = Module["_joypad_delete"] = function() {
              return (_joypad_delete = Module["_joypad_delete"] = Module["asm"]["I"]).apply(null, arguments)
          };
          var _rewind_append = Module["_rewind_append"] = function() {
              return (_rewind_append = Module["_rewind_append"] = Module["asm"]["J"]).apply(null, arguments)
          };
          var _rewind_delete = Module["_rewind_delete"] = function() {
              return (_rewind_delete = Module["_rewind_delete"] = Module["asm"]["K"]).apply(null, arguments)
          };
          var _emulator_new_simple = Module["_emulator_new_simple"] = function() {
              return (_emulator_new_simple = Module["_emulator_new_simple"] = Module["asm"]["L"]).apply(null, arguments)
          };
          var _emulator_get_ticks_f64 = Module["_emulator_get_ticks_f64"] = function() {
              return (_emulator_get_ticks_f64 = Module["_emulator_get_ticks_f64"] = Module["asm"]["M"]).apply(null, arguments)
          };
          var _emulator_run_until_f64 = Module["_emulator_run_until_f64"] = function() {
              return (_emulator_run_until_f64 = Module["_emulator_run_until_f64"] = Module["asm"]["N"]).apply(null, arguments)
          };
          var _rewind_get_newest_ticks_f64 = Module["_rewind_get_newest_ticks_f64"] = function() {
              return (_rewind_get_newest_ticks_f64 = Module["_rewind_get_newest_ticks_f64"] = Module["asm"]["O"]).apply(null, arguments)
          };
          var _rewind_get_oldest_ticks_f64 = Module["_rewind_get_oldest_ticks_f64"] = function() {
              return (_rewind_get_oldest_ticks_f64 = Module["_rewind_get_oldest_ticks_f64"] = Module["asm"]["P"]).apply(null, arguments)
          };
          var _emulator_set_default_joypad_callback = Module["_emulator_set_default_joypad_callback"] = function() {
              return (_emulator_set_default_joypad_callback = Module["_emulator_set_default_joypad_callback"] = Module["asm"]["Q"]).apply(null, arguments)
          };
          var _emulator_set_bw_palette_simple = Module["_emulator_set_bw_palette_simple"] = function() {
              return (_emulator_set_bw_palette_simple = Module["_emulator_set_bw_palette_simple"] = Module["asm"]["R"]).apply(null, arguments)
          };
          var _rewind_new_simple = Module["_rewind_new_simple"] = function() {
              return (_rewind_new_simple = Module["_rewind_new_simple"] = Module["asm"]["S"]).apply(null, arguments)
          };
          var _rewind_begin = Module["_rewind_begin"] = function() {
              return (_rewind_begin = Module["_rewind_begin"] = Module["asm"]["T"]).apply(null, arguments)
          };
          var _emulator_set_rewind_joypad_callback = Module["_emulator_set_rewind_joypad_callback"] = function() {
              return (_emulator_set_rewind_joypad_callback = Module["_emulator_set_rewind_joypad_callback"] = Module["asm"]["U"]).apply(null, arguments)
          };
          var _rewind_to_ticks_wrapper = Module["_rewind_to_ticks_wrapper"] = function() {
              return (_rewind_to_ticks_wrapper = Module["_rewind_to_ticks_wrapper"] = Module["asm"]["V"]).apply(null, arguments)
          };
          var _rewind_end = Module["_rewind_end"] = function() {
              return (_rewind_end = Module["_rewind_end"] = Module["asm"]["W"]).apply(null, arguments)
          };
          var _set_joyp_up = Module["_set_joyp_up"] = function() {
              return (_set_joyp_up = Module["_set_joyp_up"] = Module["asm"]["X"]).apply(null, arguments)
          };
          var _set_joyp_down = Module["_set_joyp_down"] = function() {
              return (_set_joyp_down = Module["_set_joyp_down"] = Module["asm"]["Y"]).apply(null, arguments)
          };
          var _set_joyp_left = Module["_set_joyp_left"] = function() {
              return (_set_joyp_left = Module["_set_joyp_left"] = Module["asm"]["Z"]).apply(null, arguments)
          };
          var _set_joyp_right = Module["_set_joyp_right"] = function() {
              return (_set_joyp_right = Module["_set_joyp_right"] = Module["asm"]["_"]).apply(null, arguments)
          };
          var _set_joyp_B = Module["_set_joyp_B"] = function() {
              return (_set_joyp_B = Module["_set_joyp_B"] = Module["asm"]["$"]).apply(null, arguments)
          };
          var _set_joyp_A = Module["_set_joyp_A"] = function() {
              return (_set_joyp_A = Module["_set_joyp_A"] = Module["asm"]["aa"]).apply(null, arguments)
          };
          var _set_joyp_start = Module["_set_joyp_start"] = function() {
              return (_set_joyp_start = Module["_set_joyp_start"] = Module["asm"]["ba"]).apply(null, arguments)
          };
          var _set_joyp_select = Module["_set_joyp_select"] = function() {
              return (_set_joyp_select = Module["_set_joyp_select"] = Module["asm"]["ca"]).apply(null, arguments)
          };
          var _get_frame_buffer_ptr = Module["_get_frame_buffer_ptr"] = function() {
              return (_get_frame_buffer_ptr = Module["_get_frame_buffer_ptr"] = Module["asm"]["da"]).apply(null, arguments)
          };
          var _get_frame_buffer_size = Module["_get_frame_buffer_size"] = function() {
              return (_get_frame_buffer_size = Module["_get_frame_buffer_size"] = Module["asm"]["ea"]).apply(null, arguments)
          };
          var _get_audio_buffer_ptr = Module["_get_audio_buffer_ptr"] = function() {
              return (_get_audio_buffer_ptr = Module["_get_audio_buffer_ptr"] = Module["asm"]["fa"]).apply(null, arguments)
          };
          var _get_audio_buffer_capacity = Module["_get_audio_buffer_capacity"] = function() {
              return (_get_audio_buffer_capacity = Module["_get_audio_buffer_capacity"] = Module["asm"]["ga"]).apply(null, arguments)
          };
          var _ext_ram_file_data_new = Module["_ext_ram_file_data_new"] = function() {
              return (_ext_ram_file_data_new = Module["_ext_ram_file_data_new"] = Module["asm"]["ha"]).apply(null, arguments)
          };
          var _get_file_data_ptr = Module["_get_file_data_ptr"] = function() {
              return (_get_file_data_ptr = Module["_get_file_data_ptr"] = Module["asm"]["ia"]).apply(null, arguments)
          };
          var _get_file_data_size = Module["_get_file_data_size"] = function() {
              return (_get_file_data_size = Module["_get_file_data_size"] = Module["asm"]["ja"]).apply(null, arguments)
          };
          var calledRun;

          function ExitStatus(status) {
              this.name = "ExitStatus";
              this.message = "Program terminated with exit(" + status + ")";
              this.status = status
          }
          dependenciesFulfilled = function runCaller() {
              if (!calledRun) run();
              if (!calledRun) dependenciesFulfilled = runCaller
          };

          function run(args) {
              args = args || arguments_;
              if (runDependencies > 0) {
                  return
              }
              preRun();
              if (runDependencies > 0) {
                  return
              }

              function doRun() {
                  if (calledRun) return;
                  calledRun = true;
                  Module["calledRun"] = true;
                  if (ABORT) return;
                  initRuntime();
                  preMain();
                  readyPromiseResolve(Module);
                  if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                  postRun()
              }
              if (Module["setStatus"]) {
                  Module["setStatus"]("Running...");
                  setTimeout(function() {
                      setTimeout(function() {
                          Module["setStatus"]("")
                      }, 1);
                      doRun()
                  }, 1)
              } else {
                  doRun()
              }
          }
          Module["run"] = run;

          function exit(status, implicit) {
              if (implicit && noExitRuntime && status === 0) {
                  return
              }
              if (noExitRuntime) {} else {
                  EXITSTATUS = status;
                  exitRuntime();
                  if (Module["onExit"]) Module["onExit"](status);
                  ABORT = true
              }
              quit_(status, new ExitStatus(status))
          }
          if (Module["preInit"]) {
              if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
              while (Module["preInit"].length > 0) {
                  Module["preInit"].pop()()
              }
          }
          run();


          return createBinjgb.ready
      }
  );
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = createBinjgb;
else if (typeof define === 'function' && define['amd'])
  define([], function() {
      return createBinjgb;
  });
else if (typeof exports === 'object')
  exports["createBinjgb"] = createBinjgb;
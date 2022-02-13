include_directories(include)
if (CMAKE_SYSTEM_NAME STREQUAL Emscripten)
    MESSAGE(${CMAKE_CURRENT_LIST_DIR}/library.js)
    # DISABLE_EXCEPTION_CATCHING 是否禁用异常精确判断（如果不禁用0会增加100多k代码量）
    # ENVIRONMENT=web只在web环境中执行，避免引入require
    # NO_DISABLE_EXCEPTION_CATCHING用于debug
    # ASSERTIONS 用于debug
    # PTHREAD_POOL_SIZE这是设置线程池的数量，如果不设置的话会开线程阻塞会直接阻塞主线程
    # 正式版本请使用-03优化
    add_executable(wasm_emscripten bridge.cpp)
    target_link_libraries(wasm_emscripten core)
    set_target_properties(wasm_emscripten PROPERTIES
            LINK_FLAGS "-O3                 \
        -s EXPORTED_FUNCTIONS='[         \
            \"_getNum\",         \
            \"_malloc\",         \
            \"_main\",         \
            \"_free\",         \
            \"_freeBuffer\",         \
            \"_callJS\"]'              \
        -s 'EXPORTED_RUNTIME_METHODS=[     \
            \"ccall\",                           \
            \"cwrap\",                           \
            \"getValue\"]'                       \
        --js-library ${CMAKE_CURRENT_LIST_DIR}/library.js \
        --pre-js ${CMAKE_CURRENT_LIST_DIR}/pre.js \
        --post-js ${CMAKE_CURRENT_LIST_DIR}/post.js\
        --closure 1\
        -s WASM=0 \
        -s WASM_ASYNC_COMPILATION=0 \
        -s FILESYSTEM=0 \
        -s ASSERTIONS=0 \
        -s LLD_REPORT_UNDEFINED=0 \
        -s USE_PTHREADS=0 \
        -s FULL_ES3=1 \
        -s NO_EXIT_RUNTIME=1 \
        -s INITIAL_MEMORY=125829120\
        -s ALLOW_MEMORY_GROWTH=0")

    #    add_subdirectory(test)
    #    enable_testing()
endif()
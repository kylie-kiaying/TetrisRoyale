Traceback (most recent call last):
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\multiprocessing\process.py", line 314, in _bootstrap
    self.run()
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\multiprocessing\process.py", line 108, in run
    self._target(*self._args, **self._kwargs)
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\site-packages\uvicorn\_subprocess.py", line 80, in subprocess_started
    target(sockets=sockets)
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\site-packages\uvicorn\server.py", line 65, in run
    return asyncio.run(self.serve(sockets=sockets))
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\asyncio\runners.py", line 194, in run
    return runner.run(main)
           ^^^^^^^^^^^^^^^^
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\asyncio\runners.py", line 118, in run
    return self._loop.run_until_complete(task)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\asyncio\base_events.py", line 684, in run_until_complete
    return future.result()
           ^^^^^^^^^^^^^^^
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\site-packages\uvicorn\server.py", line 69, in serve
    await self._serve(sockets)
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\site-packages\uvicorn\server.py", line 76, in _serve
    config.load()
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\site-packages\uvicorn\config.py", line 434, in load
    self.loaded_app = import_from_string(self.app)
                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\site-packages\uvicorn\importer.py", line 19, in import_from_string
    module = importlib.import_module(module_str)
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\importlib\__init__.py", line 90, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1331, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 935, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 994, in exec_module
  File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed
  File "C:\Users\65978\Documents\TetrisRoyale\backend\auth-service\app\main.py", line 2, in <module>
    from app.controller.auth_controller import router as auth_router
  File "C:\Users\65978\Documents\TetrisRoyale\backend\auth-service\app\controller\auth_controller.py", line 4, in <module>
    from app.db.session import get_db
  File "C:\Users\65978\Documents\TetrisRoyale\backend\auth-service\app\db\session.py", line 7, in <module>
    engine = create_async_engine(DATABASE_URL, echo=True)
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\site-packages\sqlalchemy\ext\asyncio\engine.py", line 120, in create_async_engine
    sync_engine = _create_engine(url, **kw)
                  ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<string>", line 2, in create_engine
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\site-packages\sqlalchemy\util\deprecations.py", line 281, in warned
    return fn(*args, **kwargs)  # type: ignore[no-any-return]
           ^^^^^^^^^^^^^^^^^^^
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\site-packages\sqlalchemy\engine\create.py", line 546, in create_engine
    u = _url.make_url(url)
        ^^^^^^^^^^^^^^^^^^
  File "C:\Users\65978\AppData\Local\Programs\Python\Python312\Lib\site-packages\sqlalchemy\engine\url.py", line 846, in make_url
    raise exc.ArgumentError(
sqlalchemy.exc.ArgumentError: Expected string or URL object, got None

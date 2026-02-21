# myapp/middleware.py
import traceback


class PrintExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        try:
            response = self.get_response(request)
        except Exception as e:
            print("Exception in LiveServerTestCase:")
            traceback.print_exc()
            raise
        return response
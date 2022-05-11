from django.shortcuts import render
from rest_framework.views import APIView
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from .models import User
from .serializers import LoginSerializer
from rest_framework.response import Response
from knox.models import AuthToken

class AuthView(APIView):
    def get(self, request):
        if request.GET.get('userId'):
            user = User.objects.get(username=request.GET.get('userId'))
            return JsonResponse({"isAuth": True,
                                 "isAdmin": False if user.is_superuser == 0 else True})
        else:
            return JsonResponse({"isAuth": False})

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('id', None)
        password = request.data.get('password', None)
        name = request.data.get('name', None)
        email = request.data.get('email', None)
        address = request.data.get('address', None)
        phone = request.data.get('phone', None)
        mydogBreed = request.data.get('dog_breed', None)
        mydogWeight = request.data.get('dog_weight', None)
        mydogAge = request.data.get('dog_age', None)

        user = User(username=username, password=make_password(password), name=name, email=email,
                    address=address, phone=phone, mydogBreed=mydogBreed, mydogWeight=mydogWeight, mydogAge=mydogAge)
        try:
            user.save()
        except Exception as e:
            return JsonResponse({"success": False,
                                 "err": e})

        return JsonResponse({"success": True})

class LoginView(APIView):
    def get(self, request):
        queryset = User.objects.all()
        serializer_class = LoginSerializer(queryset, many=True)
        return Response(serializer_class.data)

    def post(self, request):
        loginUserId = request.data.get('id', None)
        loginPassword = request.data.get('password', None)

        try:
            user = User.objects.get(username=loginUserId)
        except:
            return JsonResponse({"loginSuccess": False})

        if check_password(loginPassword, user.password):
            token = AuthToken.objects.create(user)
            user.token = token[1]
            user.tokenExp = token[0].expiry
            user.save()

            return JsonResponse({"loginSuccess": True,
                                 "userId": user.username})
        else:
            return JsonResponse({"loginSuccess": False})

class LogoutView(APIView):
    def get(self, request):
        if request.GET.get('userId'):
            user = User.objects.get(username=request.GET.get('userId'))
            user.token = ""
            user.tokenExp = None
            user.save()
            return Response(status=200)
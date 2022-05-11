from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

class User(AbstractUser):
    objects = UserManager()

    username = models.CharField(max_length=20, verbose_name='아이디', unique=True)
    password = models.CharField(max_length=200, verbose_name='비밀번호')
    name = models.CharField(max_length=20, verbose_name='이름')
    email = models.CharField(max_length=45, verbose_name='이메일')
    address = models.CharField(max_length=45, verbose_name='주소')
    phone = models.CharField(max_length=20, verbose_name='핸드폰번호')
    mydogBreed = models.CharField(max_length=20, verbose_name='견종')
    mydogWeight = models.CharField(max_length=20, verbose_name='반려견 체중')
    mydogAge = models.CharField(max_length=20, verbose_name='반려견 나이')
    token = models.CharField(max_length=200, verbose_name='토큰')
    tokenExp = models.DateTimeField(auto_now=False, auto_now_add=False, verbose_name='토큰 유효 기간')

    def __str__(self):
        return self.username
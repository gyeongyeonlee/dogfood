import sys
import io
import pandas as pd
import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
from konlpy.tag import Mecab
from collections import Counter

import csv

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding="utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding="utf-8")
# print(sys.argv[1])

# 받아온 리뷰 전처리
def predict(new_sentence):
  new_sentence.drop_duplicates(subset=['review'], inplace=True)
  new_sentence['review'] = new_sentence['review'].str.replace('[^ㄱ-ㅎㅏ-ㅣ가-힣 ]','')
  new_sentence['review'].replace('', np.nan, inplace=True)
  new_sentence = new_sentence.dropna(how='any') # Null 값 제거

  mecab = Mecab(dicpath=r"C:\mecab\mecab-ko-dic")
  stopwords = ['도', '는', '다', '의', '가', '이', '은', '한', '에', '하', '고', '을', '를', '인', '듯', '과', '와', '네',
  '들', '듯', '지', '임', '게', '사료', '강아지', '배송', '구매', '감사', '샘플', '제품', '주문', '걱정', '저희']
  
  new_sentence['tokenized'] = new_sentence['review'].apply(mecab.nouns)
  new_sentence['tokenized'] = new_sentence['tokenized'].apply(lambda x: [item for item in x if item not in stopwords])
  new_sentence = new_sentence['tokenized'].values

  tokenizer = Tokenizer()
  tokenizer.fit_on_texts(new_sentence)
#   print(list(tokenizer.word_index.keys()))
  word_list = list(tokenizer.word_index.keys())
  valid_word = []

  for i in word_list:
      if len(i) >= 2:
        valid_word.append(i)
#   print(valid_word[:10])

  for i in valid_word:
    if i == valid_word[9]: break
    print(i, end=',')
  print(valid_word[9])


# 변환한 review csv 파일 읽기
df = pd.read_csv('csv-writer.csv')
predict(df)

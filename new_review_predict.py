import sys
import io
import pandas as pd
import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
from konlpy.tag import Mecab
import csv
import re

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding="utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding="utf-8")
# print(sys.argv[1])

# 받아온 리뷰 전처리
def predict(before_sentence, new_sentence):
  before_sentence.drop_duplicates(subset=['Review'], inplace=True)
  before_sentence = before_sentence.dropna(axis=0)

  before_sentence['Review'] = before_sentence['Review'].str.replace("[^ㄱ-ㅎㅏ-ㅣ가-힣]", "")
  before_sentence['Review'].replace('', np.nan, inplace=True)
  before_sentence = before_sentence.dropna(axis=0)

  mecab = Mecab(dicpath=r"C:\mecab\mecab-ko-dic")
  stopwords = ['도', '는', '다', '의', '가', '이', '은', '한', '에', '하', '고', '을', '를', '인', '듯', '과', '와', '네', '들', '듯', '지', '임', '게', '사료']
  
  before_sentence['tokenized'] = before_sentence['Review'].apply(mecab.morphs)
  before_sentence['tokenized'] = before_sentence['tokenized'].apply(lambda x: [item for item in x if item not in stopwords])

  X_train = before_sentence['tokenized'].values
  tokenizer = Tokenizer()
  tokenizer.fit_on_texts(X_train)

  threshold = 2
  total_cnt = len(tokenizer.word_index) # 단어의 수
  rare_cnt = 0 # 등장 빈도수가 threshold보다 작은 단어의 개수를 카운트

  # 단어와 빈도수의 쌍(pair)을 key와 value로 받는다.
  for key, value in tokenizer.word_counts.items():
      # 단어의 등장 빈도수가 threshold보다 작으면
      if(value < threshold):
          rare_cnt = rare_cnt + 1

  vocab_size = total_cnt - rare_cnt + 2
  tokenizer = Tokenizer(vocab_size, oov_token = 'OOV') 
  tokenizer.fit_on_texts(X_train)

  # 여기서부터
  new_sentence = re.sub(r'[^ㄱ-ㅎㅏ-ㅣ가-힣 ]','', new_sentence)
  new_sentence = mecab.morphs(new_sentence)
  new_sentence = [word for word in new_sentence if not word in stopwords]

  encoded = tokenizer.texts_to_sequences([new_sentence])
  pad_new = pad_sequences(encoded, maxlen = 416)

  loaded_model = load_model('best_model4.h5')
  score = float(loaded_model.predict(pad_new))

  f = open('new_result.csv', 'w', encoding='utf8', newline='')
  wr = csv.writer(f)
  if(score > 0.5):
    print("{:.2f}% 확률로 긍정 리뷰입니다.".format(score * 100))
    wr.writerow(["{:.2f}% 확률로 긍정 리뷰입니다.".format(score * 100)])
  else:
    print("{:.2f}% 확률로 부정 리뷰입니다.".format((1 - score) * 100))
    wr.writerow(["{:.2f}% 확률로 부정 리뷰입니다.".format((1 - score) * 100)])


# 변환한 review csv 파일 읽기
df1 = pd.read_csv(sys.argv[1])
df2 = pd.read_csv(sys.argv[2])
# print(df['review'].values[0])
predict(df1, df2['review'].values[0])


# for i in sys.argv:
#     print("반복문",i)


# def print_test(arg):
#     print(arg)

# if __name__ == '__main__':
#     print_test(sys.argv[1])
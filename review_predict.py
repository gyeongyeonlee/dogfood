import sys
import io
import pandas as pd
import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
from konlpy.tag import Mecab
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
  stopwords = ['도', '는', '다', '의', '가', '이', '은', '한', '에', '하', '고', '을', '를', '인', '듯', '과', '와', '네', '들', '듯', '지', '임', '게', '사료']
  
  new_sentence['tokenized'] = new_sentence['review'].apply(mecab.morphs)
  new_sentence['tokenized'] = new_sentence['tokenized'].apply(lambda x: [item for item in x if item not in stopwords])
  new_sentence = new_sentence['tokenized'].values

  tokenizer = Tokenizer()
  tokenizer.fit_on_texts(new_sentence)

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
  tokenizer.fit_on_texts(new_sentence)
  new_sentence = tokenizer.texts_to_sequences(new_sentence)

  max_len = max(len(review) for review in new_sentence)
  new_sentence = pad_sequences(new_sentence, maxlen=max_len)

  loaded_model = load_model('best_model4.h5')
  score = loaded_model.predict(new_sentence)
  # print(score)

  f = open('result.csv', 'w', encoding='utf8', newline='')
  wr = csv.writer(f)
  if(score.mean() > 0.5):
    print("대다수의 사용자들은 긍정적인 반응을 남겼습니다.")
    print("{:.2f}% 확률로 긍정적인 리뷰가 많습니다.".format(score.mean() * 100))
    wr.writerow(["대다수의 사용자들은 긍정적인 반응을 남겼습니다."])
    wr.writerow(["{:.2f}% 확률로 긍정적인 리뷰가 많습니다.".format(score.mean() * 100)])
  else:
    print("대다수의 사용자들은 부정적인 반응을 남겼습니다.")
    print("{:.2f}% 확률로 부정적인 리뷰가 많습니다.".format((1 - score.mean()) * 100))
    wr.writerow(["대다수의 사용자들은 부정적인 반응을 남겼습니다."])
    wr.writerow(["{:.2f}% 확률로 부정적인 리뷰가 많습니다.".format(score.mean() * 100)])


# 변환한 review csv 파일 읽기
df = pd.read_csv(sys.argv[1])
# print(df.head(5))

# with tf.device('/cpu:0'):
#     new_model = tf.keras.models.load_model('BiLSTM_b32.h5')
predict(df)


# for i in sys.argv:
#     print("반복문",i)


# def print_test(arg):
#     print(arg)

# if __name__ == '__main__':
#     print_test(sys.argv[1])
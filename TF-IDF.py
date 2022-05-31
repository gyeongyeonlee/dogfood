import pandas as pd
import numpy as np
import scipy as sp
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding="utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding="utf-8")
# print(type(sys.argv[2]))
data = pd.read_csv(sys.argv[1], encoding='utf-8')
# data = pd.read_csv('1-5 합본.csv', encoding='utf-8')
df = pd.DataFrame()
df = data["data"]

vect = CountVectorizer()
countvect = vect.fit_transform(df)
sorted(vect.vocabulary_)

countvect_df = pd.DataFrame(countvect.toarray(), columns = sorted(vect.vocabulary_))
cosine_similarity(countvect_df, countvect_df)

vect = TfidfVectorizer()
tfvect = vect.fit(df)
tfidv_df = pd.DataFrame(tfvect.transform(df).toarray(), columns = sorted(vect.vocabulary_))

cosine_matrix=cosine_similarity(tfidv_df, tfidv_df)

product_id = {}
for i, c in enumerate(data['title']): product_id[i] = c

id_product = {}
for i, c in product_id.items(): id_product[c] = i


# id 추출
idx = id_product[sys.argv[2]] # 0번 인덱스 
sim_scores = [(i, c) for i, c in enumerate(cosine_matrix[idx]) if i != idx] # 자기 자신을 제외한 상품들의 유사도 및 인덱스를 추출 
sim_scores = sorted(sim_scores, key = lambda x: x[1], reverse=True) # 유사도가 높은 순서대로 정렬 
# print(sim_scores[0:5]) # 상위 10개의 인덱스와 유사도를 추출

# 인덱스를 Title로 변환 
sim_scores = [(product_id[i], score) for i, score in sim_scores[0:5]]
for i in range(len(sim_scores)):
    if i == len(sim_scores) - 1:break
    print(sim_scores[i][0], end=',')
print(sim_scores[len(sim_scores) - 1][0])


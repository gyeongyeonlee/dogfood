import pandas as pd
import numpy as np
import scipy as sp
from sklearn.metrics.pairwise import cosine_similarity
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding="utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding="utf-8")

data = pd.read_csv(sys.argv[1], encoding='utf-8')
# data = pd.read_csv('cosine.csv', encoding='utf-8')

pro_user_rating = data.pivot_table('rate',index='product',columns='author')
# print(pro_user_rating)

pro_user_rating.fillna(0, inplace=True)
# print(pro_user_rating.head())

similarity_rate = cosine_similarity(pro_user_rating, pro_user_rating)

similarity_rate_df = pd.DataFrame(
data = similarity_rate,
index = pro_user_rating.index,
columns = pro_user_rating.index)

# print(similarity_rate_df.head())

##유사도 가까운 상품일수록 1에 가까움

def recommend(product):

    return similarity_rate_df[product].sort_values(ascending=False)[:6]

# print(recommend(sys.argv[2]))
cosine_similarity_list = list(recommend(sys.argv[2]).index)[1:]

for i in range(len(cosine_similarity_list)):
    if i == len(cosine_similarity_list) - 1: break
    print(cosine_similarity_list[i], end=",")
print(cosine_similarity_list[len(cosine_similarity_list) - 1])
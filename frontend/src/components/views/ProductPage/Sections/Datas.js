
// 브랜드: NOW, 로얄캐닌, ANF, 오리젠, 네츄럴코어, 마이펫닥터, 아카나, 하림펫푸드, 내추럴발란스
// 급여대상: 어덜트, 퍼피, 대형견, 시니어, 임신/수유, + 전연령견용
// 기능: 다이어트/중성화, 인도어, 저알러지, 피부/털개선, 눈물개선/눈건강, 비뇨계, 뼈/관절강화, 퍼포먼스

//브랜드 정의
const brand = [
    { "_id": 1, "name": "NOW" }, 
    { "_id": 2, "name": "로얄캐닌" },
    { "_id": 3, "name": "ANF" }, 
    { "_id": 4, "name": "오리젠" },
    { "_id": 5, "name": "네츄럴코어" }, 
    { "_id": 6, "name": "마이펫닥터" },
    { "_id": 7, "name": "아카나" }, 
    { "_id": 8, "name": "하림펫푸드" },
    { "_id": 9, "name": "내추럴발란스" }, 
    { "_id": 10, "name": "듀먼" }
]

//급여대상 
const age = [
    { "_id": 1, "name": "퍼피" },
    { "_id": 2, "name": "어덜트" },    
    { "_id": 3, "name": "시니어" },
    { "_id": 4, "name": "대형견" },    
    { "_id": 5, "name": "임신/수유" },
    { "_id": 6, "name": "전연령견" }
]

//가격   
const price = [
    {
        "_id" : 0,
        "name" : "Any",
        "array" : []
    },
    {
        "_id" : 1,
        "name" : "10,000원 이하",
        "array" : [0, 10000]
    },
    {
        "_id" : 2,
        "name" : "10,000원-20,000원",
        "array" : [10000, 20000]
    },
    {
        "_id" : 3,
        "name" : "20,000원-40,000원",
        "array" : [20000, 40000]
    },
    {
        "_id" : 4,
        "name" : "40,000원-60,000원",
        "array" : [40000, 60000]
    },
    {
        "_id" : 5,
        "name" : "60,000원 이상",
        "array" : [60000, 150000000]
    }
]

export {
    brand,
    age,
    price
}
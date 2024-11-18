# Data pengguna dalam format dictionary
users = [
    {
        "username": "a",
        "password": "a",
        "usia": "3",
        "jeniskelamin": "Laki-laki 👦",
        "fotoprofile": "1134204.png",
        "jenisgym": "Strength 💪",
        "deskripsi": "Saya mantap 🧘🧘🧘🧘🧘🧘",
        "totalulasan": 0
    },
    {
        "username": "b",
        "password": "b",
        "usia": "19",
        "jeniskelamin": "Laki-laki 👦",
        "fotoprofile": "IMG_20210831_203258_740.jpg",
        "jenisgym": "Yoga 🧘",
        "deskripsi": "adadwa sada dw asdwd asd adwa as dasd ad aggat ara ",
        "totalulasan": 1
    },
    {
        "username": "c",
        "password": "c",
        "usia": "3",
        "jeniskelamin": "Laki-laki 👦",
        "fotoprofile": "1134204.png",
        "jenisgym": "Strength 💪",
        "deskripsi": "Saya mantap 🧘🧘🧘🧘🧘🧘",
        "totalulasan": 2
    },
    {
        "username": "d",
        "password": "d",
        "usia": "3",
        "jeniskelamin": "Laki-laki 👦",
        "fotoprofile": "1134204.png",
        "jenisgym": "Strength 💪",
        "deskripsi": "Saya mantap 🧘🧘🧘🧘🧘🧘",
        "totalulasan": 3
    },
    {
        "username": "e",
        "password": "e",
        "usia": "3",
        "jeniskelamin": "Laki-laki 👦",
        "fotoprofile": "1134204.png",
        "jenisgym": "Strength 💪",
        "deskripsi": "Saya mantap 🧘🧘🧘🧘🧘🧘",
        "totalulasan": 4
    },
    {
        "username": "f",
        "password": "f",
        "usia": "3",
        "jeniskelamin": "Laki-laki 👦",
        "fotoprofile": "1134204.png",
        "jenisgym": "Strength 💪",
        "deskripsi": "Saya mantap 🧘🧘🧘🧘🧘🧘",
        "totalulasan": 15
    }
]

# Mengurutkan user berdasarkan totalulasan secara menurun
sorted_users = sorted(users, key=lambda x: x['totalulasan'], reverse=True)
print(sorted_users)

# Menyimpan hasil ke dalam list
user_list = [user for user in sorted_users]
print()
print()
print()
print()
# Menampilkan hasil
print(user_list)

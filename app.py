from flask import Flask, render_template, render_template_string, request, jsonify, session
import json
import os

from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.secret_key = "rahasia123"

socketio = SocketIO(app)

@app.route("/", methods=["GET"])
def index():
    return render_template('login.html')











def register_cek_namafotoprofile(namafotoprofile : str ):
    extension = ["png", "jpg"]
    return "." in namafotoprofile and namafotoprofile.rsplit('.',1)[1] in extension

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username_post = request.form['username']
        password_post = request.form['password']
        usia_post = request.form['usia']
        jeniskelamin_post = request.form['jeniskelamin']
        jenisgym_post = request.form['jenisgym']
        deskripsi_post = request.form['deskripsi']
        fotoprofile_post = request.files['fotoprofile']
        fotoprofilenama_post = fotoprofile_post.filename
        
        if register_cek_namafotoprofile(fotoprofilenama_post) != True:
            return jsonify({"status" : "fototidakvalid"})
        
        with open("json/users.json", "r") as data_json_users:
            data_ekstrak = json.load(data_json_users)
            print(data_ekstrak)
            for data_json_user in data_ekstrak:
                print(data_json_user)
                if data_json_user["username"] == username_post:
                    return jsonify({'status' : "sama"})
            
            data_user_baru = {"username" : username_post, "password" : password_post, "usia" : usia_post, "jeniskelamin" : jeniskelamin_post,  "fotoprofile" : fotoprofilenama_post, "jenisgym": jenisgym_post, "deskripsi" : deskripsi_post, "totalulasan" : 0 }
            data_ekstrak.append(data_user_baru)
                
            fotoprofile_post.save(os.path.join("static","uploads","fotoprofile",fotoprofilenama_post))
            with open("json/users.json", "w") as data_json_users:
                json.dump(data_ekstrak, data_json_users, indent=4)
                return jsonify({"status" : "tidak sama"})
    return render_template("register.html")

@app.route("/login", methods=['GET', "POST"])
def login():
    if request.method == "POST":
        with open("json/users.json", "r") as users_json:
            users_json = json.load(users_json)
            
            username_post = request.form['username']
            password_post = request.form['password']
            
            for user in users_json:
                if user["username"] == username_post and user["password"] == password_post:
                    session["username"] = user["username"]
                    session["password"] = user["password"]
                    session["usia"] = user["usia"]
                    session["jeniskelamin"] = user["jeniskelamin"]
                    session["fotoprofile"] = user["fotoprofile"]
                    session["jenisgym"] = user["jenisgym"]
                    session["deskripsi"] = user["deskripsi"]
                    session["totalulasan"] = user["totalulasan"]
                    return jsonify({"status" : "berhasillogin"})
            return jsonify({"status" : "gagallogin"})
    return render_template('login.html') 




















login_tidak_valid = '''<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    </head>
    <body>
        <script>
            Swal.fire(
                {
                    'title' : "Belum Login",
                    'text' : "Session Tidak Valid, Login Ulang",
                    'icon' : 'warning',
                    'confirmButtonText' : "Login"
                }
            ).then((hasil)=>{if (hasil.isConfirmed){window.location.href = '/login'}})

        </script>
    </body>
    </html> '''
    
@app.route('/beranda', methods=["GET"])
def beranda():
    if 'username' in session:
        # Load user, gym, and module data
        with open("json/users.json", "r") as users_file:
            users = json.load(users_file)
        
        with open("json/gyms.json", "r") as gyms_file:
            gyms = json.load(gyms_file)
        
        with open("json/modules.json", "r") as modules_file:
            modules = json.load(modules_file)
        
        # Calculate statistics
        total_users = len(users)
        total_gyms = len(gyms)
        total_reviews = sum(user.get('totalulasan', 0) for user in users)
        
        # Pass data to the template
        return render_template("beranda.html", total_users=total_users, total_gyms = total_gyms, total_reviews=total_reviews, gyms=gyms[:5], modules=modules)
    else:
        return render_template_string(login_tidak_valid)


@app.route('/maps', methods=["GET", "POST"])
def maps():
    if 'username' in session:
        if request.method == "POST":
            komentar_post = request.form['komentar']
            bintang_post = request.form['bintang']

            # Buka dan baca data gyms.json
            with open("json/gyms.json", "r") as gyms_json_data:
                gyms_json_data = json.load(gyms_json_data)
                new_gyms_json_data = []

                # Loop semua gym untuk proses ulasan
                for gym in gyms_json_data:
                    if gym['nama'] == session["namagym"]:
                        # Periksa apakah user sudah memberikan ulasan sebelumnya
                        if any(ulasan['nama'] == session['username'] for ulasan in gym['ulasan']):
                            return jsonify({'status': "gagalulas"})
                        
                        # Tambah ulasan baru
                        ulasanbaru = {
                            "nama": session['username'],
                            "foto": session['fotoprofile'],
                            "komentar": komentar_post,
                            "bintang": bintang_post
                        }
                        gym['ulasan'].append(ulasanbaru)

                        # Update jumlah ulasan user di users.json
                        with open("json/users.json", "r") as users_json_data:
                            users_json_data = json.load(users_json_data)
                            for user in users_json_data:
                                if user['username'] == session['username']:
                                    user['totalulasan'] += 1
                                    session['totalulasan'] = user['totalulasan']
                            # Simpan kembali data user
                            with open("json/users.json", "w") as users_json_file:
                                json.dump(users_json_data, users_json_file, indent=4)

                    # Tambahkan gym (baik yang diupdate maupun tidak) ke daftar baru
                    new_gyms_json_data.append(gym)

            # Simpan kembali gyms.json
            with open("json/gyms.json", "w") as gyms_json_file:
                json.dump(new_gyms_json_data, gyms_json_file, indent=4)

            return jsonify({'status': "berhasilulas"})

        # Jika metode GET, muat data gyms
        with open("json/gyms.json", "r") as gyms_file:
            gyms = json.load(gyms_file)
        return render_template("maps.html", gyms=gyms)
    
    else:
        return render_template_string("Login tidak valid.")

@app.route('/datamaps', methods=['GET', 'POST'])
def datamaps():
        # Memuat data dari JSON
    with open('json/gyms.json') as f:
        gym_data = json.load(f)
        print(gym_data)
    return jsonify(gym_data)

@app.route('/ambilgym', methods=['GET', 'POST'])
def ambilgym():
    nama = request.args.get('nama')
    with open("json/gyms.json", "r") as gyms_json_data:
        gyms_json_data = json.load(gyms_json_data)
        found = False
        for gym in gyms_json_data:
            if gym["nama"] == nama:
                session["namagym"] = gym["nama"]
                found = True
                break
                # print(session['namagym'])
            else:
                found = False
        
        if found == True:
            return jsonify(gym)
        else:
            return jsonify({"status": "gymtidakada"})


@app.route('/module', methods=["GET", "POST"])
def module():
    if 'username' in session:
        with open("json/modules.json", "r") as modules_json_data:
            modules_json_data = json.load(modules_json_data)
        return render_template("module.html", modules = modules_json_data)
    else:
        return render_template_string(login_tidak_valid)
    
@app.route('/profile', methods=["GET", "POST"])
def profile():
    if 'username' in session:
        if request.method == "POST":
            username_post = request.form['username']
            password_post = request.form['password']
            usia_post = request.form['usia']
            jeniskelamin_post = request.form['jeniskelamin']
            jenisgym_post = request.form['jenisgym']
            deskripsi_post = request.form['deskripsi']
            
            inputfoto = False
            if not request.files['fotoprofile']:
                inputfoto = False
                print("A")
                fotoprofilenama_post = session['fotoprofile']
            else:
                inputfoto = True
                print("B")
                fotoprofile_post = request.files['fotoprofile']
                fotoprofilenama_post = fotoprofile_post.filename
                # print(fotoprofilenama_post)
            
            if inputfoto:
                if register_cek_namafotoprofile(fotoprofilenama_post) != True:
                    return jsonify({"status" : "gagaleditkarenafoto"})
            
            with open("json/users.json", "r") as data_json_users:
                data_ekstrak = json.load(data_json_users)
                data_json_users_hasil_edit = []
                # print(data_ekstrak)
                for data_json_user in data_ekstrak:
                    if data_json_user["username"] == session['username']:
                        data_json_user['username'] = username_post
                        data_json_user['password'] = password_post
                        data_json_user['usia'] = usia_post
                        data_json_user['jeniskelamin'] = jeniskelamin_post
                        data_json_user['jenisgym'] = jenisgym_post
                        data_json_user['deskripsi'] = deskripsi_post
                        data_json_user['fotoprofile'] = fotoprofilenama_post
                        
                        if inputfoto:
                            fotoprofile_post.save(os.path.join("static","uploads","fotoprofile",fotoprofilenama_post))
                            os.remove(os.path.join("static", "uploads", "fotoprofile", session["fotoprofile"]))
                        
                        session["username"] = data_json_user["username"]
                        session["password"] = data_json_user["password"]
                        session["usia"] = data_json_user["usia"]
                        session["jeniskelamin"] = data_json_user["jeniskelamin"]
                        session["fotoprofile"] = data_json_user["fotoprofile"]
                        session["jenisgym"] = data_json_user["jenisgym"]
                        session["deskripsi"] = data_json_user["deskripsi"]
                        session["totalulasan"] = data_json_user["totalulasan"]
                    data_json_users_hasil_edit.append(data_json_user)
                    
                with open("json/users.json", "w") as data_json_users:
                    json.dump(data_json_users_hasil_edit, data_json_users, indent=4)
                    print('Berhasil Update Profile')
                    return jsonify({"status" : "berhasiledit"})
    else:
        return render_template_string(login_tidak_valid)
    if request.method == 'GET':
        with open("json/users.json", "r") as data_json_users:    
            data_json_users = json.load(data_json_users)
            sorted_user_berdasarkan_totalulasan = sorted(data_json_users, key= lambda x : x['totalulasan'], reverse=True)
            print(sorted_user_berdasarkan_totalulasan)
            return render_template('profile.html', top5raters=sorted_user_berdasarkan_totalulasan[:5])


# @app.route('/openchat', methods=["GET", "POST"])
# def openchat():
#     if 'username' in session:
#         return render_template("openchat.html")
#     else:
#         return render_template_string(login_tidak_valid)

@app.route('/logout', methods=["GET"])
def logout():
    session.pop('username', None)
    return render_template('login.html')

@app.route('/test', methods=['GET'])
def test():
    return render_template('test.html')

@socketio.on('message')
def handleMessage(datamsg):
    # print(f'Message: {msg}')
    # send(msg, broadcast=True)
    name = datamsg.get('name')
    foto = datamsg.get('foto')
    msg = datamsg.get('msg')
    
    emit('message', {'name' : name, 'foto' : foto, 'msg' : msg}, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=80)
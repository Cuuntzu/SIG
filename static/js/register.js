
function sa_berhasilregister(){
    Swal.fire("Berhasil", "Berhasil Register, Silahkan lanjut login", "success").then((()=>{window.location.href = "/login"}))

}
function sa_gagalregister(){
    Swal.fire("Gagal", "Akun sudah ada, pakai yang lain", "error")
}

function sa_gagalregisterfoto(){
    Swal.fire("Gagal", "Foto Tidak Valid", "error")
}

function kirimdata(event){
    event.preventDefault();

    const form = document.getElementById("form")
    const formData = new FormData(form)

    fetch("/register", {method : "POST", body : formData}).then(hasil => hasil.json()).then(hasiljson => {if (hasiljson.status == "sama"){sa_gagalregister();form.reset();} else if (hasiljson.status == "tidak sama"){sa_berhasilregister();form.reset();} else if (hasiljson.status == "fototidakvalid"){sa_gagalregisterfoto();form.reset();}} ).catch(error => console.error("Error :", error))
}
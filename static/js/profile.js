
function sa_berhasiledit(){
    Swal.fire("Berhasil", "Berhasil Edit!", "success").then((()=>{location.reload(true)}))

}
// function sa_gagaledit(){
//     Swal.fire("Gagal", "Gagal Edit!", "error")
// }

function sa_gagaleditkarenafoto(){
    Swal.fire("Gagal", "Foto Tidak Valid!", "error")
}

function kirimdata(event){
    event.preventDefault();

    const form = document.getElementById("form")
    const formData = new FormData(form)

    fetch("/profile", {method : "POST", body : formData}).then(hasil => hasil.json()).then(hasiljson => {if (hasiljson.status == "berhasiledit"){sa_berhasiledit();} else if (hasiljson.status == "gagaleditkarenafoto"){sa_gagaleditkarenafoto();form.reset();}} ).catch(error => console.error("Error :", error))
}
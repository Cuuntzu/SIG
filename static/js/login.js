
  function sa_salah() {
    Swal.fire("Error", "Username atau Password Salah!", "error");
  }
  function sa_berhasil() {
    Swal.fire("Mantap", "Masuk keberanda!", "success").then(() => {
      window.location.href = "/beranda";
    });
  }

  function kirimdata(event) {
    event.preventDefault();

    const form = document.getElementById("form");
    const formData = new FormData(form);

    fetch("/login", { method: "POST", body: formData })
      .then((hasil) => hasil.json())
      .then((hasiljson) => {
        if (hasiljson.status == "berhasillogin") {
          sa_berhasil();
          form.reset();
        } else {
          sa_salah();
        }
      })
      .catch((error) => "Error ", error);
  }

const StreamPage = () => {
  return (
  <div style={{ textAlign: "center", marginTop: "40px" }}>
  <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Bienvenido a la StreamPage</h2>

  <img
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnEaLrlJc_GPbsGHtZPE7Pzyf56vHwPesSpg&s"
    alt="YodaCholo"
    style={{ maxWidth: "300px", borderRadius: "12px", marginBottom: "20px" }}
  />

  <iframe
    width="360"
    height="215"
    src="https://www.youtube.com/embed/fQiBogLpqjQ"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    style={{ borderRadius: "12px" }}
  ></iframe>
</div>
  );
};

export default StreamPage;
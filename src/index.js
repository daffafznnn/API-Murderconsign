import dotenv from "dotenv";
dotenv.config();

const FRAMEWORK = process.env.FRAMEWORK || "express"

const startServer = async () => {
  // Menginisialisasi koneksi database
  const { connectSQL } = await import("./database/connectSql.js");
  await connectSQL();

  let app;
  // Menginisialisasi framework
  if (FRAMEWORK === "express") {
    app = (await import("./frameworks/express/app.js")).default;
  } else if (FRAMEWORK === "nestjs") {
    // kondisi jika menggunakan framework nestjs atau other
    // const { NestFactory } = await import("@nestjs/core");
    // const { AppModule } = await import("./frameworks/nestjs/app.module.ts");
    // app = await NestFactory.create(AppModule);
    console.log("NestJs not found");
  }

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on ${FRAMEWORK} and port ${PORT}`);
  });
};

startServer();
package main

import (
	"patient-crm/controllers"
	"patient-crm/database"
	"patient-crm/middleware"
	"patient-crm/models"

	"github.com/gin-gonic/gin"
)

func main() {
	client, err := database.NewSqliteClient()
	if err != nil {
		panic(err)
	}

	migrate(client)

	r := gin.Default()

	r.Use(middleware.CORSMiddleware())

	userRepo := database.NewSQLiteUserRepository(client.DB)
	authController := controllers.NewAuthController(userRepo)
	r.POST("/register", authController.Register)
	r.POST("/login", authController.Login)

	patientRepo := database.NewSQLitePatientRepository(client.DB)
	patientController := controllers.NewPatientController(patientRepo)
	usersController := controllers.NewUserController(userRepo)

	protectedRoutes := r.Group("/").Use(middleware.JWTAuthMiddleware())
	{
		protectedRoutes.GET("/patients/:id", patientController.GetPatient)
		protectedRoutes.GET("/patients", patientController.GetPatients)
		protectedRoutes.POST("/patients", patientController.CreatePatient)
		protectedRoutes.GET("/users/:id", usersController.GetUser)
	}

	r.Run(":3000")
}

func migrate(client *database.SQLiteClient) {
	client.DB.AutoMigrate(&models.User{})
	client.DB.AutoMigrate(&models.Patient{})
	client.DB.AutoMigrate(&models.Address{})
	client.DB.AutoMigrate(&models.CustomField{})
	client.DB.AutoMigrate(&models.PatientCustomField{})
}

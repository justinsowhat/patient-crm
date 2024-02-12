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

	// auth
	r.POST("/register", authController.Register)
	r.POST("/login", authController.Login)

	patientRepo := database.NewSQLitePatientRepository(client.DB)
	patientController := controllers.NewPatientController(patientRepo)
	usersController := controllers.NewUserController(userRepo)

	sectionRepo := database.NewSQLiteSectionRepository(client.DB)
	sectionController := controllers.NewSectionController(sectionRepo)

	protectedRoutes := r.Group("/").Use(middleware.JWTAuthMiddleware())
	{
		// patient
		protectedRoutes.GET("/patients/:id", patientController.GetPatient)
		protectedRoutes.GET("/patients", patientController.GetPatients)
		protectedRoutes.POST("/patients", patientController.CreatePatient)
		protectedRoutes.PUT("/patients", patientController.UpdatePatient)

		// seed patients
		protectedRoutes.POST("/patients/seed", patientController.SeedPatients)

		// addresses
		protectedRoutes.GET("/patients/:id/addresses", patientController.GetPatientAddresses)
		protectedRoutes.POST("/patients/:id/addresses", patientController.CreatePatientAddresses)
		protectedRoutes.PUT("/patients/:id/addresses", patientController.UpdatePatientAddresses)

		// patients' custom sections
		protectedRoutes.GET("/patients/:id/customSections", patientController.GetPatientCustomSectionsData)
		protectedRoutes.PUT("/patients/:id/customSections", patientController.UpdatePatientCustomSectionsData)

		// custom sections and fields
		protectedRoutes.GET("/customSections", sectionController.GetCustomSections)
		protectedRoutes.POST("/customSections", sectionController.CreateSection)
		protectedRoutes.GET("/customSections/:id/fields", sectionController.GetCustomFields)
		protectedRoutes.POST("/customSections/:id/fields", sectionController.CreateCustomField)

		// user
		protectedRoutes.GET("/users/:id", usersController.GetUser)
	}

	r.Run(":3000")
}

func migrate(client *database.SQLiteClient) {
	client.DB.AutoMigrate(&models.User{})
	client.DB.AutoMigrate(&models.Patient{})
	client.DB.AutoMigrate(&models.CareTeam{})
	client.DB.AutoMigrate(&models.Address{})
	client.DB.AutoMigrate(&models.CustomSection{})
	client.DB.AutoMigrate(&models.CustomField{})
	client.DB.AutoMigrate(&models.CustomFieldValue{})
}

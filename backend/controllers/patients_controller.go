package controllers

import (
	"net/http"
	"patient-crm/database"
	"patient-crm/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PatientController struct {
	repo database.PatientRepository
}

func NewPatientController(repo database.PatientRepository) *PatientController {
	return &PatientController{repo: repo}
}

func (c *PatientController) CreatePatient(context *gin.Context) {
	var patient models.Patient
	if err := context.ShouldBindJSON(&patient); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.repo.Create(&patient); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	context.JSON(http.StatusCreated, patient)
}

func (c *PatientController) GetPatient(context *gin.Context) {
	id := context.Param("id")

	patient, err := c.repo.GetById(id)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Failed to retrieve patient"})
		return
	}

	context.JSON(http.StatusOK, patient)
}

func (c *PatientController) GetPatients(context *gin.Context) {
	page, err := strconv.Atoi(context.DefaultQuery("page", "1"))
	if err != nil {
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"failed to parse the page value": err.Error()})
			return
		}
	}

	limit, _ := strconv.Atoi(context.DefaultQuery("limit", "10"))
	if err != nil {
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"failed to parse the limit value": err.Error()})
			return
		}
	}

	patients, err := c.repo.GetPatients("", []models.PatientFilterParam{}, []models.PatientSortParam{}, models.PatientPaginationParams{
		Limit: limit,
		Page:  page,
	})

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": patients})
}

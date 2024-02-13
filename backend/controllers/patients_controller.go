package controllers

import (
	"fmt"
	"math/rand"
	"net/http"
	"patient-crm/database"
	"patient-crm/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type PatientController struct {
	repo database.PatientRepository
}

func NewPatientController(repo database.PatientRepository) *PatientController {
	return &PatientController{repo: repo}
}

func (c *PatientController) CreatePatient(context *gin.Context) {
	userID := context.GetString("userID")

	var patient models.Patient
	if err := context.ShouldBindJSON(&patient); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.repo.Create(&patient, userID); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	context.JSON(http.StatusCreated, patient)
}

func (c *PatientController) UpdatePatient(context *gin.Context) {
	var patient models.Patient
	if err := context.ShouldBindJSON(&patient); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.repo.Update(&patient); err != nil {
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
	userID := context.GetString("userID")

	patients, err := c.repo.GetPatients(userID)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": patients})
}

func (c *PatientController) GetPatientAddresses(context *gin.Context) {
	id := context.Param("id")

	addresses, err := c.repo.GetPatientAddresses(id)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Failed to retrieve addresses"})
		return
	}

	context.JSON(http.StatusOK, addresses)
}

func (c *PatientController) CreatePatientAddresses(context *gin.Context) {
	id := context.Param("id")
	var addresses []*models.Address
	if err := context.ShouldBindJSON(&addresses); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := c.repo.CreatePatientAddresses(id, addresses)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Failed to retrieve addresses"})
		return
	}

	context.JSON(http.StatusOK, addresses)
}

func (c *PatientController) UpdatePatientAddresses(context *gin.Context) {
	id := context.Param("id")
	var addresses []*models.Address
	if err := context.ShouldBindJSON(&addresses); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := c.repo.UpdatePatientAddresses(id, addresses)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update addresses"})
		return
	}

	context.JSON(http.StatusOK, addresses)
}

func (c *PatientController) GetPatientCustomSectionsData(context *gin.Context) {
	id := context.Param("id")

	sections, err := c.repo.GetPatientCustomSectionsData(id)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	normalizedSections := make([]customSectionData, 0)
	for _, section := range sections {
		fmt.Println(len(section.Fields))
		normalizedFields := make([]customFieldData, 0)
		for _, field := range section.Fields {
			normalizedFields = append(normalizedFields, customFieldData{
				ID:       field.ID,
				Name:     field.Name,
				DataType: field.DataType,
				Value:    getCustomFieldValue(field),
			})
		}
		normalizedSections = append(normalizedSections, customSectionData{
			ID:     section.ID,
			Name:   section.Name,
			Fields: normalizedFields,
		})
	}

	context.JSON(http.StatusOK, gin.H{"data": normalizedSections})
}

func (c *PatientController) UpdatePatientCustomSectionsData(context *gin.Context) {
	var values []*models.CustomFieldValue
	if err := context.ShouldBindJSON(&values); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := c.repo.UpdatePatientCustomSectionsData(values)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update values"})
		return
	}

	context.JSON(http.StatusOK, values)
}

type customFieldData struct {
	ID       uuid.UUID `json:"id"`
	Name     string    `json:"name"`
	DataType string    `json:"dataType"`
	Value    string    `json:"value"`
}

type customSectionData struct {
	ID     uuid.UUID         `json:"id"`
	Name   string            `json:"name"`
	Fields []customFieldData `json:"fields"`
}

func getCustomFieldValue(field models.CustomField) string {
	if len(field.Values) == 0 {
		return ""
	}
	return field.Values[0].Value
}

func (c *PatientController) SeedPatients(context *gin.Context) {
	userID := context.GetString("userID")

	const numberOfPatients = 25

	for i := 0; i < numberOfPatients; i++ {
		patient := generateRandomPatient()

		if err := c.repo.Create(patient, userID); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		addresses := generateDummyAddresses()
		if err := c.repo.CreatePatientAddresses(patient.ID.String(), addresses); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
	}
	context.JSON(http.StatusOK, gin.H{})
}

func generateRandomPatient() *models.Patient {
	firstNames := []string{"John", "Jane", "Mike", "Sara", "Alex"}
	middleNames := []string{"", "Lee", "Ann", "James"}
	lastNames := []string{"Doe", "Smith", "Johnson", "Williams"}
	dobs := []string{"01/01/1991", "05/12/1986", "07/23/2002", "03/27/1995"}

	src := rand.NewSource(time.Now().UnixNano())
	r := rand.New(src)
	return &models.Patient{
		FirstName:  firstNames[r.Intn(len(firstNames))],
		MiddleName: middleNames[r.Intn(len(middleNames))],
		LastName:   lastNames[r.Intn(len(lastNames))],
		DOB:        dobs[r.Intn(len(dobs))],
		Status:     models.ValidStatuses[r.Intn(len(models.ValidStatuses))],
	}
}

func generateDummyAddresses() []*models.Address {
	return []*models.Address{
		{
			Street1: "112 NE 54th St",
			City:    "Portland",
			State:   "Oregon",
			Zip:     "97211",
			Type:    "mailing",
		},
		{
			Street1: "112 NE 54th St",
			City:    "Portland",
			State:   "Oregon",
			Zip:     "97211",
			Type:    "billing",
		},
	}
}

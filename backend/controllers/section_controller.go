package controllers

import (
	"net/http"
	"patient-crm/database"
	"patient-crm/models"

	"github.com/gin-gonic/gin"
)

type SectionController struct {
	repo database.SectionRepository
}

func NewSectionController(repo database.SectionRepository) *SectionController {
	return &SectionController{repo: repo}
}

func (c *SectionController) CreateSection(context *gin.Context) {
	userID := context.GetString("userID")

	var section models.CustomSection
	if err := context.ShouldBindJSON(&section); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.repo.Create(&section, userID); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	context.JSON(http.StatusCreated, section)
}

func (c *SectionController) Update(context *gin.Context) {
	var section models.CustomSection
	if err := context.ShouldBindJSON(&section); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.repo.Update(&section); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	context.JSON(http.StatusCreated, section)
}

func (c *SectionController) GetCustomSection(context *gin.Context) {
	id := context.Param("id")

	section, err := c.repo.GetById(id)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Failed to retrieve section"})
		return
	}

	context.JSON(http.StatusOK, section)
}

func (c *SectionController) GetCustomSections(context *gin.Context) {
	userID := context.GetString("userID")

	sections, err := c.repo.GetCustomSections(userID)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": sections})
}

func (c *SectionController) GetCustomFields(context *gin.Context) {
	id := context.Param("id")

	fields, err := c.repo.GetCustomFields(id)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": fields})
}

func (c *SectionController) CreateCustomField(context *gin.Context) {
	id := context.Param("id")

	var field models.CustomField
	if err := context.ShouldBindJSON(&field); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := c.repo.CreateCustomField(&field, id)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": field})
}

package database

import (
	"patient-crm/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SectionRepository interface {
	GetById(id string) (*models.CustomSection, error)
	Create(section *models.CustomSection, userID string) error
	Update(section *models.CustomSection) error
	GetCustomSections(userID string) ([]models.CustomSection, error)
	GetCustomFields(sectionId string) ([]models.CustomField, error)
	CreateCustomField(field *models.CustomField, sectionId string) error
}

type SQLiteSectionRepository struct {
	db *gorm.DB
}

func NewSQLiteSectionRepository(db *gorm.DB) *SQLiteSectionRepository {
	return &SQLiteSectionRepository{db: db}
}

func (repo *SQLiteSectionRepository) GetById(id string) (*models.CustomSection, error) {
	var section models.CustomSection
	result := repo.db.Where("id = ?", id).First(&section)
	if result.Error != nil {
		return nil, result.Error
	}

	return &section, nil
}

func (repo *SQLiteSectionRepository) Create(section *models.CustomSection, userID string) error {
	userIDUUID, err := uuid.Parse(userID)
	if err != nil {
		return err
	}

	section.UserID = userIDUUID
	return repo.db.Table("custom_sections").Create(section).Error
}

func (repo *SQLiteSectionRepository) Update(section *models.CustomSection) error {
	return repo.db.Table("custom_sections").Save(&section).Error
}

func (repo *SQLiteSectionRepository) GetCustomSections(userID string) ([]models.CustomSection, error) {
	var sections []models.CustomSection

	query := repo.db

	if err := query.Preload("Fields").Where("user_id = ?", userID).Find(&sections).Error; err != nil {
		return nil, err
	}

	return sections, nil
}

func (repo *SQLiteSectionRepository) GetCustomFields(sectionId string) ([]models.CustomField, error) {
	var fields []models.CustomField

	query := repo.db

	if err := query.Where("custom_section_id = ?", sectionId).Find(&fields).Error; err != nil {
		return nil, err
	}

	return fields, nil
}

func (repo *SQLiteSectionRepository) CreateCustomField(field *models.CustomField, sectionId string) error {
	sectionIDUUID, err := uuid.Parse(sectionId)
	if err != nil {
		return err
	}

	field.CustomSectionId = sectionIDUUID

	return repo.db.Table("custom_fields").Create(field).Error
}

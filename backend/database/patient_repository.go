package database

import (
	models "patient-crm/models"

	"gorm.io/gorm"
)

type PatientRepository interface {
	GetById(patientId string) (*models.Patient, error)
	Create(patient *models.Patient) error
	Update(patient *models.Patient) error
	GetPatients(searchTerm string, filters []models.PatientFilterParam, sorts []models.PatientSortParam, pagination models.PatientPaginationParams) ([]models.Patient, error)
	// UpdatePatients(additionalField interface{}) (error)
}

type SQLitePatientRepository struct {
	db *gorm.DB
}

func NewSQLitePatientRepository(db *gorm.DB) *SQLitePatientRepository {
	return &SQLitePatientRepository{db: db}
}

func (repo *SQLitePatientRepository) GetById(patientId string) (*models.Patient, error) {
	var patient models.Patient
	result := repo.db.Where("id = ?", patientId).First(&patient)
	if result.Error != nil {
		return nil, result.Error
	}

	return &patient, nil
}

func (repo *SQLitePatientRepository) Create(patient *models.Patient) error {
	return repo.db.Table("patients").Create(patient).Error
}

func (repo *SQLitePatientRepository) Update(patient *models.Patient) error {
	return repo.db.Table("patients").Save(patient).Error
}

func (repo *SQLitePatientRepository) GetPatients(searchTerm string, filters []models.PatientFilterParam, sorts []models.PatientSortParam, pagination models.PatientPaginationParams) ([]models.Patient, error) {
	var patients []models.Patient

	query := repo.db

	// searchTerm = strings.TrimSpace(strings.ToLower(searchTerm))
	// query = query.Where("LOWER(first_name) LIKE '%?%' OR LOWER(middle_name) LIKE '%?%' OR LOWER(last_name) LIKE '%?%'", searchTerm, searchTerm, searchTerm)

	// if len(filters) > 0 {
	// 	for _, filter := range filters {
	// 		query = query.Where("? IN ( ? )", filter.Column, filter.Values)
	// 	}
	// }

	// if len(sorts) > 0 {
	// 	for _, sort := range sorts {
	// 		query = query.Order(fmt.Sprintf("%s %s", sort.Column, sort.Direction))
	// 	}
	// }

	// Calculate the offset
	offset := (pagination.Page - 1) * pagination.Limit

	// Add Offset and Limit to the query for pagination
	if err := query.Offset(offset).Limit(pagination.Limit).Find(&patients).Error; err != nil {
		return nil, err
	}

	return patients, nil
}

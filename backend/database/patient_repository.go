package database

import (
	models "patient-crm/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PatientRepository interface {
	GetById(patientId string) (*models.Patient, error)
	Create(patient *models.Patient, userID string) error
	Update(patient *models.Patient) error
	GetPatients(userID string) ([]models.Patient, error)
	// TODO: these should be under a new repository
	GetPatientAddresses(patientId string) ([]*models.Address, error)
	CreatePatientAddresses(patientId string, addresses []*models.Address) error
	UpdatePatientAddresses(patientId string, addresses []*models.Address) error
	GetPatientCustomSectionsData(patientId string) ([]*models.CustomSection, error)
	UpdatePatientCustomSectionsData(values []*models.CustomFieldValue) error
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

func (repo *SQLitePatientRepository) Create(patient *models.Patient, userID string) error {
	err := repo.db.Table("patients").Create(patient).Error
	if err != nil {
		return err
	}

	userIDUUID, err := uuid.Parse(userID)
	if err != nil {
		return err
	}

	careTeam := models.CareTeam{UserId: userIDUUID, PatientId: patient.ID}
	return repo.db.Table("care_teams").Create(&careTeam).Error
}

func (repo *SQLitePatientRepository) Update(patient *models.Patient) error {
	return repo.db.Table("patients").Save(&patient).Error
}

func (repo *SQLitePatientRepository) GetPatients(userID string) ([]models.Patient, error) {
	validPatientIds, err := repo.getPatientIdsForUser(userID)
	if err != nil {
		return nil, err
	}

	var patients []models.Patient

	query := repo.db

	if err := query.Where("id IN (?)", validPatientIds).Find(&patients).Error; err != nil {
		return nil, err
	}

	return patients, nil
}

func (repo *SQLitePatientRepository) getPatientIdsForUser(userID string) ([]uuid.UUID, error) {
	var careTeams []models.CareTeam
	if err := repo.db.Where("user_id = ?", userID).Find(&careTeams).Error; err != nil {
		return nil, err
	}

	var patientIDs []uuid.UUID
	for _, ct := range careTeams {
		patientIDs = append(patientIDs, ct.PatientId)
	}

	return patientIDs, nil
}

func (repo *SQLitePatientRepository) GetPatientAddresses(patientId string) ([]*models.Address, error) {
	var addresses []*models.Address

	query := repo.db

	if err := query.Where("patient_id = ?", patientId).Find(&addresses).Error; err != nil {
		return nil, err
	}

	return addresses, nil
}

func (repo *SQLitePatientRepository) CreatePatientAddresses(patientId string, addresses []*models.Address) error {
	for _, address := range addresses {
		address.PatientID = uuid.MustParse(patientId)
		err := repo.db.Table("addresses").Create(&address).Error
		if err != nil {
			return err
		}
	}

	return nil
}

func (repo *SQLitePatientRepository) UpdatePatientAddresses(patientId string, addresses []*models.Address) error {
	for _, address := range addresses {
		address.PatientID = uuid.MustParse(patientId)
		err := repo.db.Table("addresses").Save(&address).Error
		if err != nil {
			return err
		}
	}

	return nil
}

func (repo *SQLitePatientRepository) GetPatientCustomSectionsData(patientId string) ([]*models.CustomSection, error) {
	var sections []*models.CustomSection

	query := repo.db

	if err := query.Preload("Fields").Preload("Fields.Values", "patient_id = ?", patientId).Find(&sections).Error; err != nil {
		return nil, err
	}

	return sections, nil
}

func (repo *SQLitePatientRepository) UpdatePatientCustomSectionsData(values []*models.CustomFieldValue) error {
	for _, value := range values {
		var foundValue *models.CustomFieldValue
		_ = repo.db.Table("custom_field_values").Where("patient_id = ? AND custom_field_id = ?", value.PatientID, value.CustomFieldID).Find(&foundValue).Error

		if foundValue.ID == uuid.Nil {
			err := repo.db.Table("custom_field_values").Save(&value).Error
			if err != nil {
				return err
			}
		} else {
			foundValue.Value = value.Value
			err := repo.db.Table("custom_field_values").Save(&foundValue).Error
			if err != nil {
				return err
			}
		}

	}

	return nil
}

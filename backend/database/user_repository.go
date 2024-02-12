package database

import (
	models "patient-crm/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user models.User) error
	FindByEmail(email string) (*models.User, error)
	FindById(id string) (*models.User, error)
}

type SQLiteUserRepository struct {
	db *gorm.DB
}

func NewSQLiteUserRepository(db *gorm.DB) *SQLiteUserRepository {
	return &SQLiteUserRepository{db: db}
}

func (repo *SQLiteUserRepository) Create(user models.User) error {
	return repo.db.Create(&user).Error
}

func (repo *SQLiteUserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	result := repo.db.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

func (repo *SQLiteUserRepository) FindById(id string) (*models.User, error) {
	var user models.User
	result := repo.db.Where("id = ?", id).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

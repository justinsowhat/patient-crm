package models

import "github.com/google/uuid"

type CustomSection struct {
	Base
	Name   string    `json:"name" gorm:"unique;not null"`
	UserID uuid.UUID `json:"userId"`
	User   User
	Fields []CustomField `json:"fields" gorm:"foreignKey:CustomSectionId"`
}

type CustomField struct {
	Base
	Name            string    `json:"name" gorm:"unique;not null"`
	DataType        string    `json:"dataType"`
	CustomSectionId uuid.UUID `json:"customSectionId"`
	CustomSection   CustomSection
	Values          []CustomFieldValue `json:"values" gorm:"foreignKey:CustomFieldID"`
}

type CustomFieldValue struct {
	Base
	PatientID     uuid.UUID `json:"patientId" gorm:"type:uuid;column:patient_id"`
	CustomFieldID uuid.UUID `json:"customFieldId"`
	Value         string    `json:"value"`
	Patient       Patient
	CustomField   CustomField
}

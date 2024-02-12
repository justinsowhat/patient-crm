package models

import "github.com/google/uuid"

type Address struct {
	Base
	Street1   string    `json:"street1" gorm:"not null"`
	Stree2    string    `json:"stree2"`
	City      string    `json:"city" gorm:"not null"`
	State     string    `json:"state" gorm:"not null"`
	Zip       string    `json:"zip" gorm:"not null"`
	Type      string    `json:"type" gorm:"not null"`
	PatientID uuid.UUID `json:"patientId"`
	Patient   Patient
}

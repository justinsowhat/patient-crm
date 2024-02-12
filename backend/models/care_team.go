package models

import "github.com/google/uuid"

type CareTeam struct {
	Base
	UserId    uuid.UUID `json:"userId"`
	User      User
	PatientId uuid.UUID `json:"patientId"`
	Patient   Patient
}

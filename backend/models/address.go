package models

type Address struct {
	Base
	Street    string `json:"street"`
	City      string `json:"city"`
	State     string `json:"state"`
	Zip       string `json:"zip"`
	PatientID uint   `json:"patientId"`
	Type      string `json:"type"`
}

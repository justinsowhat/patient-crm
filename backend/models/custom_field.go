package models

type CustomField struct {
	Base
	FieldName string `json:"fieldName" gorm:"unique"`
	DataType  string `json:"dataType"`
}

type PatientCustomField struct {
	Base
	PatientID     uint   `json:"patientId"`
	CustomFieldID uint   `json:"customFieldId"`
	Value         string `json:"value"`
}

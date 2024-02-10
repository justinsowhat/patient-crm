package models

import (
	"errors"
)

type Status string

const (
	StatusInquiry    Status = "Inquiry"
	StatusOnboarding Status = "Onboarding"
	StatusActive     Status = "Active"
	StatusChurned    Status = "Churned"
)

var validStatuses = []Status{StatusInquiry, StatusOnboarding, StatusActive, StatusChurned}

type Patient struct {
	Base
	FirstName  string `json:"firstName"`
	MiddleName string `json:"middleName"`
	LastName   string `json:"lastName"`
	DOB        string `json:"dob"`
	Status     Status `json:"status"`
}

func (p *Patient) SetStatus(s Status) error {
	for _, validStatus := range validStatuses {
		if s == validStatus {
			p.Status = s
			return nil
		}
	}
	return errors.New("invalid status")
}

type PatientFilterParam struct {
	Column string        `json:"column"`
	Values []interface{} `json:"values"`
}

type PatientSortParam struct {
	Column    string `json:"column"`
	Direction string `json:"direction"`
}

type PatientPaginationParams struct {
	Limit int `json:"limit"`
	Page  int `json:"page"`
}

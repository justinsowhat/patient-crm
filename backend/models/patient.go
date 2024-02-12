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
	FirstName  string `json:"firstName" gorm:"not null"`
	MiddleName string `json:"middleName"`
	LastName   string `json:"lastName" gorm:"not null"`
	DOB        string `json:"dob" gorm:"not null"`
	Status     Status `json:"status" gorm:"not null"`
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

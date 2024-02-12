package models

// To limit the scope of the project we assume a user is a provider
// each provider has a their own set of patients
// in the future, if we want to allow patients to log in to the system
// we can create such a mapping: a User can be either a Provider or a Patient
// there will be a new providers table, and both providers and patients table have a new foregin key user_id
type User struct {
	Base
	FirstName string `json:"firstName" gorm:"not null"`
	LastName  string `json:"lastName" gorm:"not null"`
	Email     string `json:"email" gorm:"unique"`
	Password  string `json:"password" gorm:"not null"`
}

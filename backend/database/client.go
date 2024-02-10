package database

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Client interface {
}

type SQLiteClient struct {
	DB *gorm.DB
}

// Using SQLite to limit the scope of the project
func NewSqliteClient() (*SQLiteClient, error) {
	db, err := gorm.Open(sqlite.Open("my-go-backend.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!")
	}

	return &SQLiteClient{DB: db}, err
}

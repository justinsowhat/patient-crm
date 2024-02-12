package database

import (
	"log"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Client interface {
}

type SQLiteClient struct {
	DB *gorm.DB
}

// Using SQLite to limit the scope of the project
func NewSqliteClient() (*SQLiteClient, error) {

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			ParameterizedQueries:      true,
			Colorful:                  true,
		},
	)

	db, err := gorm.Open(sqlite.Open("my-go-backend.db"), &gorm.Config{Logger: newLogger})
	if err != nil {
		panic("Failed to connect to database!")
	}

	return &SQLiteClient{DB: db}, err
}

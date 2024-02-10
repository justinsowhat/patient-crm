package controllers

import (
	"net/http"
	"patient-crm/database"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	repo database.UserRepository
}

func NewUserController(repo database.UserRepository) *UserController {
	return &UserController{repo: repo}
}

func (c *UserController) GetUser(context *gin.Context) {
	id := context.Param("id")

	user, err := c.repo.FindById(id)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Failed to retrieve user"})
		return
	}

	context.JSON(http.StatusOK, user)
}

package controllers

import (
	"net/http"
	"patient-crm/auth"
	"patient-crm/database"
	"patient-crm/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
	repo database.UserRepository
}

func NewAuthController(repo database.UserRepository) *AuthController {
	return &AuthController{repo: repo}
}

func (c *AuthController) Register(context *gin.Context) {
	var user models.User
	if err := context.ShouldBindJSON(&user); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	foundUser, _ := c.repo.FindByEmail(user.Email)
	if foundUser != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "User with the same email already exists!"})
		return
	}

	// hash the passowrd so that it's not a plain text stored in the db
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}

	user.Password = string(hashedPassword)
	if err := c.repo.Create(user); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	context.JSON(http.StatusCreated, user)
}
func (c *AuthController) Login(context *gin.Context) {
	var user models.User
	if err := context.ShouldBindJSON(&user); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	foundUser, err := c.repo.FindByEmail(user.Email)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "Email incorrect"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(user.Password))
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "Email or password incorrect"})
		return
	}

	expirationTime := time.Now().Add(2 * time.Hour)
	claims := &auth.Claims{
		UserId: foundUser.ID,
		Email:  foundUser.Email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(auth.JwtKey)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Error signing token"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"token": tokenString})
}

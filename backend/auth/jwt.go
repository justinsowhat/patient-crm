package auth

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

// this can be a configurable env var
var JwtKey = []byte("your_secret_key")

type Claims struct {
	UserId uuid.UUID `json:"userId"`
	Email  string    `json:"email"`
	jwt.StandardClaims
}

func GetUserFromToken(r *http.Request) (uuid.UUID, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return uuid.Nil, fmt.Errorf("authorization header is required")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return JwtKey, nil
	})

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims.UserId, nil
	} else {
		return uuid.Nil, err
	}
}

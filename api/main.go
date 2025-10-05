package main

import (
	"github.com/gin-gonic/gin"
)

func handlePing(c *gin.Context) {
	response := make(map[string]string)

	response["data"] = "Successful Ping!"

	c.JSON(200, response)
}

func main() {
	router := gin.Default()

	router.GET("/ping", handlePing)

	router.Run("localhost:8080")
}

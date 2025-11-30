package main

import (
	"database/sql"
	"every-minesweeper/utils"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func handlePing(c *gin.Context) {
	response := make(map[string]string)
	response["data"] = "Successful Ping!"
	c.JSON(200, response)
}

// init is invoked before main()
func initEnv() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Fatalf(".env file not found")
	}
}

func handleDBHealth(c *gin.Context, db *sql.DB) {
	if db == nil {
		c.JSON(500, gin.H{"error": "Database not initialized"})
		return
	}

	if err := db.Ping(); err != nil {
		c.JSON(500, gin.H{"error": "Database connection failed"})
		return
	}

	c.JSON(200, gin.H{"status": "Database connection healthy"})
}

func main() {

	initEnv() // will throw on failure

	db, err := utils.ConnectToDBWithConnector()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	router := gin.Default()

	router.GET("/ping", handlePing)
	router.GET("/health/db", func(c *gin.Context) {
		handleDBHealth(c, db)
	})

	router.Run("localhost:8080")
}

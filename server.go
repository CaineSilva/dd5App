package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Server struct {
	address string
}

func handleNPC(resp http.ResponseWriter, req *http.Request) {
	fmt.Println("Receiving request")
	resp.Header().Set("Access-Control-Allow-Origin", "*")
	resp.Header().Set("Access-Control-Allow-Methods", "POST")
	resp.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Content-Type, Authorization")
	if req.Method == http.MethodPost {
		npc := &PNJ{}
		err := json.NewDecoder(req.Body).Decode(npc)
		if err != nil {
			http.Error(resp, err.Error(), http.StatusBadRequest)
			fmt.Println(err)
			return
		}
		err = npc.GenerateFile()
		if err !=  nil {
			http.Error(resp, err.Error(), http.StatusBadRequest)
			fmt.Println(err)
			return
		}
		fmt.Printf("Received NPC have been successfully generated in Markdown with name %v.md in \"out\" directory.\n", npc.Name)
	}
}

func (this Server) Start() {
	fmt.Printf("Listening on %v\n", this.address)
	mux := http.NewServeMux()
	mux.HandleFunc("/npc", handleNPC)
	http.ListenAndServe(this.address, mux)
}

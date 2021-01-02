package backend

import (
	"encoding/json"
	"fmt"
	"net/http"
	"pnjgenerator/src/backend/npc"
)

type httpBackend struct {
	port string
	templatePath string
	outPath string
	npcRoute string
}

func (this *httpBackend) handleNPC(resp http.ResponseWriter, req *http.Request) {
	fmt.Println("[BACKEND]: Receiving request")
	resp.Header().Set("Access-Control-Allow-Origin", "*")
	resp.Header().Set("Access-Control-Allow-Methods", "POST")
	resp.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Content-Type, Authorization")
	if req.Method == http.MethodPost {
		receivedNpc := &npc.NPC{
			TemplatePath: this.templatePath, 
			OutPath: this.outPath,
		}
		err := json.NewDecoder(req.Body).Decode(receivedNpc)
		if err != nil {
			http.Error(resp, err.Error(), http.StatusBadRequest)
			fmt.Println("[BACKEND]: " + err.Error())
			return
		}
		err = receivedNpc.GenerateFile()
		if err !=  nil {
			http.Error(resp, err.Error(), http.StatusBadRequest)
			fmt.Println("[BACKEND]: " + err.Error())
			return
		}
		fmt.Printf("[BACKEND]: Received NPC have been successfully generated in Markdown with name %v.md in \"%v\" directory.\n", receivedNpc.Name, this.outPath)
	}
}

func (this *httpBackend) Start() {
	go func() {
		fmt.Printf("[BACKEND]: Listening on %v\n", this.port)
		mux := http.NewServeMux()
		mux.HandleFunc(this.npcRoute, this.handleNPC)
		http.ListenAndServe(":" + this.port, mux)
	}()
}

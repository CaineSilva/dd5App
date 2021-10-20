package backend

import (
	"encoding/json"
	"fmt"
	"github.com/CaineSilva/pnjGenerator/src/backend/npc"
	"io/ioutil"
	"net/http"
)

type httpBackend struct {
	port string
	templatePath string
	outPath string
	npcRoute string
	aideddRoute string
}

func (this *httpBackend) handleAidedd(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Access-Control-Allow-Origin", "*")
	resp.Header().Set("Access-Control-Allow-Methods", "*")
	resp.Header().Set("Access-Control-Allow-Headers", "*")
	// resp.Header().Set("Access-Control-Allow-Methods", "GET")
	// resp.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Content-Type, Authorization")
	if req.Method == http.MethodGet {
		uri := req.Header.Get("uri")
		if uri == "" {
			http.Error(resp, "Unable to get URI fo the request", http.StatusBadRequest)
			fmt.Println("[BACKEND]: " + "Unable to get URI fo the request")
			return
		}
		method := req.Header.Get("method")
		switch method {
		case "GET":
			aideddResp, err := http.Get("http://www.aidedd.org" + uri)
			if err != nil {
				http.Error(resp, err.Error(), http.StatusBadRequest)
				fmt.Println("[BACKEND]: " + err.Error())
				return
			}
			bytes, err := ioutil.ReadAll(aideddResp.Body)
			if err != nil {
				http.Error(resp, err.Error(), http.StatusBadRequest)
				fmt.Println("[BACKEND]: " + err.Error())
				return
			}
			_, err = resp.Write(bytes)
			if err != nil {
				http.Error(resp, err.Error(), http.StatusBadRequest)
				fmt.Println("[BACKEND]: " + err.Error())
				return
			}
		case "POST":

		default:
			http.Error(resp, "Unknown method", http.StatusBadRequest)
			fmt.Printf("[BACKEND]: " + "Unknwon method %v\n", method)
			return
		}
	}
}

func (this *httpBackend) handleNPC(resp http.ResponseWriter, req *http.Request) {
	fmt.Println("[BACKEND]: Receiving request on " + this.npcRoute)
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
		mux.HandleFunc(this.aideddRoute, this.handleAidedd)
		http.ListenAndServe(":" + this.port, mux)
	}()
}

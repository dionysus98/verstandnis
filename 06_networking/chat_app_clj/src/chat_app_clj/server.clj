(ns chat-app-clj.server
  (:require [clojure.java.io :as io])
  (:import [java.net ServerSocket Socket]))

(def ^:const PORT 3399)

(defonce !server (atom nil))
(defonce !clients (atom #{}))

(defn broadcast! [active-client msg]
  (doseq [client @!clients]
    (try
      (.write (:client/writer client) (str "[User " (:client/id active-client) "]: " msg "\n"))
      (.flush (:client/writer client))
      (catch Exception _
        (swap! !clients disj client)))))

(defn handle-client! [^Socket socket]
  (let [reader (io/reader socket)
        writer (io/writer socket)
        client {:client/id     (inc (count @!clients))
                :client/socket socket
                :client/writer writer
                :clien/reader  reader}]
    (swap! !clients conj client)
    (future
      (doseq [msg (line-seq reader)]
        (broadcast! client msg)))))

(defn start! [& _]
  (try
    (let
     [^ServerSocket server (reset! !server (ServerSocket. PORT))]
      (println "started server on:" PORT)
      (reset! !clients [])
      (.setReuseAddress server true)
      (while true
        (let [^Socket socket (.accept server)]
          (println "New connection." (str (.getRemoteSocketAddress socket)))
          (handle-client! socket))))
    (catch Exception e (println e))))


(comment
  (.isClosed @!server)
  @!clients
  (reset! !clients [])
  :rcf)

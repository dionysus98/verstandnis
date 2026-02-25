(ns chat-app-clj.client
  (:import
   [java.net Socket])
  (:require
   [clojure.java.io :as io]))

(def ^:const PORT 3399)
(def ^:const HOST "localhost")

(def !client (atom nil))

(defn start! [& _]
  (let [^Socket client (reset! !client (Socket. HOST PORT))
        reader (io/reader client)
        writer (io/writer client)]
    (println "connected to server")

    (future
      ;; Read from server
      (try
        (doseq [line (line-seq reader)]
          (println line))
        (catch Exception _e
          (println "connection closed by server"))))


    (doseq [line (line-seq (io/reader System/in))]
      ;; write to server from stdin
      (.write writer (str line "\n"))
      (.flush writer))))



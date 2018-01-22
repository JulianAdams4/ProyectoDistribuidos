
namespace py news

struct News {
  1: string title,
  2: string description,
  3: i32 num_noticia,
  4: i32 num_accesos,
}

exception InvalidOperation {
  1: i32 what,
  2: string why
}

service GetNews {
   
   void ping(),

   list<News> getTopNews(),

   /**
    * This method has a oneway modifier. That means the client only makes
    * a request and does not listen for any response at all. Oneway methods
    * must be void.
    */
   oneway void zip()

}
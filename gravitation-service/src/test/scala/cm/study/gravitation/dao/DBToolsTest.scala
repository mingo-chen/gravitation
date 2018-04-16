package cm.study.gravitation.dao

import cm.study.gravitation.orm.{AdStat, DBConfig, DBTools, ORM}
import org.scalatest.FunSuite

import scala.collection.mutable

class DBToolsTest extends FunSuite {

  val config = DBConfig("jdbc:mysql://172.17.48.20:3306/MEIZU_DURIAN_STAT?characterEncoding=utf-8&cacheServerConfiguration=true&useLocalSessionState=true", "mysqluser", "mysqluser")

  test("try to connect mysql") {
    val db = new DBTools(config)
    val datas = db.read("select * from T_AD_STAT limit 1", AdStat.getClass)

    print("--> " + datas)
  }

  test("Map is Can modify") {
    val db_pool = mutable.HashMap[String, Any]()
    val rt1 = db_pool.get("name").getOrElse("None")
    println("==> " + rt1)

    db_pool.put("age", 19)
    val rt2 = db_pool.get("age").getOrElse(0)
    println("--> " + rt2)
  }

  test("test save") {
    DBTools(config) save AdStat(1, 2, 3, 4, 5, 6)
    DBTools(config) update AdStat(1, 2, 3, 4, 5, 6)

    /**
      * compare dsl: key1 >= value1, key1 == value1, key1 in (values1), key1 not in (values1)
      * condition dsl: (cond1).and(cond2).and(cond3_1 or cond3_2)
      *
      * Insert dsl: Insert.with(bean).on(db)
      *             Insert.with(list[bean]).on(db)
      *             Insert.sql(sql).on(db)
      *
      * delete dsl: Delete.when(condition).on(db)
      *             Delete.sql(sql).on(db)
      *
      * update dsl: Update.set(key, value).set(key, value)...when(condition).on(db)
      *             Update.sql(sql).on(db)
      *

      */
  }
}

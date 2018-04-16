package cm.study.gravitation.utils;

import akka.actor.Actor;
import akka.actor.IndirectActorProducer;
import org.springframework.context.ApplicationContext;

/**
 * Spring Actor生成器
 * 所有Actor都可以通过容器管理
 * Created by chenming on 2017/7/26.
 */
public class SpringActorProducer implements IndirectActorProducer{

    private final ApplicationContext applicationContext;

    private final String actorName;

//    private final Object[] actorArgs;

    public SpringActorProducer(ApplicationContext applicationContext, String actorName) {
        this.applicationContext = applicationContext;
        this.actorName = actorName;
//        this.actorArgs = actorArgs;
    }

    @Override
    public Actor produce() {
        return (Actor) applicationContext.getBean(actorName);
    }

    @Override
    public Class<? extends Actor> actorClass() {
        return (Class<? extends Actor>)applicationContext.getType(actorName);
    }

}

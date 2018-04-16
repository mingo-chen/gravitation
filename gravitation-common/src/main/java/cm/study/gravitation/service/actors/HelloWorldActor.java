package cm.study.gravitation.service.actors;

import akka.actor.UntypedActor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import javax.inject.Named;

/**
 * Created by chenming on 2017/7/26.
 */
//@Named("helloWorldActor")
@Scope("prototype")
@Component("helloWorldActor")
public class HelloWorldActor extends UntypedActor {

    private static Logger ILOG = LoggerFactory.getLogger(HelloWorldActor.class);

//    @Autowired
    @Inject
    private ApplicationContext applicationContext;

    @Override
    public void onReceive(Object message) throws Exception {
        ILOG.info("--> {}", message);
        ILOG.info("--> {}", applicationContext);
    }
}

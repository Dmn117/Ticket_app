import CounterSchema from "../schemas/Counter.schema";
import { ICounter } from "../interfaces/Counter.interfaces";


class Counter {

    //! Private


    //! Public

    //? Get Next Sequence Value
    public static getNextSequenceValue = async (model: string): Promise<number> => {
        const counter: ICounter = await CounterSchema.findOneAndUpdate(
            { model },
            { $inc: { sequenceValue: 1 } },
            { new: true, upsert: true }
        );

        return counter.sequenceValue;
    };
}


export default Counter;